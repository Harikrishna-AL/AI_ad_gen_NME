from modal import Image, Secret, Stub, method, gpu
from PIL import Image as PILImage

stub = Stub("sdxl")
cache_path = "/vol/cache"

def download_segmenter():
    import os
    from huggingface_hub import hf_hub_download
    import torch.nn as nn
    import torch

    os.mkdir("saved_models")
    os.mkdir("git")
    os.system("git clone https://github.com/xuebinqin/DIS git/xuebinqin/DIS")
    hf_hub_download(
        repo_id="NimaBoscarino/IS-Net_DIS-general-use",
        filename="isnet-general-use.pth",
        local_dir="saved_models",
    )
    os.system("rm -r git/xuebinqin/DIS/IS-Net/__pycache__")
    os.system("mv git/xuebinqin/DIS/IS-Net/* .")

    import data_loader_cache
    import models

    device = "cuda"
    ISNetDIS = models.ISNetDIS
    normalize = data_loader_cache.normalize
    im_preprocess = data_loader_cache.im_preprocess

    # Set Parameters
    hypar = {}  # paramters for inferencing

    # load trained weights from this path
    hypar["model_path"] = "./saved_models"
    # name of the to-be-loaded weights
    hypar["restore_model"] = "isnet-general-use.pth"
    # indicate if activate intermediate feature supervision
    hypar["interm_sup"] = False

    # choose floating point accuracy --
    # indicates "half" or "full" accuracy of float number
    hypar["model_digit"] = "full"
    hypar["seed"] = 0

    # cached input spatial resolution, can be configured into different size
    hypar["cache_size"] = [1024, 1024]

    # data augmentation parameters ---
    # mdoel input spatial size, usually use the same value hypar["cache_size"], which means we don't further resize the images
    hypar["input_size"] = [1024, 1024]
    # random crop size from the input, it is usually set as smaller than hypar["cache_size"], e.g., [920,920] for data augmentation
    hypar["crop_size"] = [1024, 1024]

    hypar["model"] = ISNetDIS()

    def build_model(hypar, device):
        net = hypar["model"]  # GOSNETINC(3,1)

        # convert to half precision
        if hypar["model_digit"] == "half":
            net.half()
            for layer in net.modules():
                if isinstance(layer, nn.BatchNorm2d):
                    layer.float()

        net.to(device)

        if hypar["restore_model"] != "":
            net.load_state_dict(
                torch.load(
                    hypar["model_path"] + "/" + hypar["restore_model"],
                    map_location=device,
                )
            )
            net.to(device)
        net.eval()
        return net

    # Build Model
    net = build_model(hypar, device)


def download_xl_model():
    from diffusers import StableDiffusionXLControlNetPipeline, ControlNetModel
    from torch import float16

    controlnet = ControlNetModel.from_pretrained(
        "diffusers/controlnet-canny-sdxl-1.0",
        torch_dtype=float16,
        variant="fp16",
        use_local_files=True,
    )

    pipe = StableDiffusionXLControlNetPipeline.from_pretrained(
        "stabilityai/stable-diffusion-xl-base-1.0",
        controlnet=controlnet,
        torch_dtype=float16,
        variant="fp16",
    )


def download_models():
    import os

    os.environ["CUDA_HOME"] = "/usr/local/cuda"
    os.environ["TRANSFORMERS_CACHE"] = cache_path

    from torch import float16
    from diffusers import (
        ControlNetModel,
        EulerAncestralDiscreteScheduler,
    )

    euler_a = EulerAncestralDiscreteScheduler.from_pretrained(
        "stabilityai/stable-diffusion-xl-base-1.0", subfolder="scheduler"
    )

    controlnet = ControlNetModel.from_pretrained(
        "diffusers/controlnet-canny-sdxl-1.0",
        torch_dtype=float16,
        variant="fp16",
    ).to("cuda")

image = (
    Image.from_registry(
        "nvidia/cuda:12.1.0-cudnn8-runtime-ubuntu22.04", add_python="3.10"
    )
    .run_commands(
        "apt-get update && apt-get install git ffmpeg build-essential cargo curl ffmpeg git libsm6 libxext6 rustc software-properties-common unzip -y",
        "apt clean && rm -rf /var/lib/apt/lists/*",
        gpu="any",
    )
    .pip_install("accelerate", "torch", gpu="any")
    .run_commands(
        "python3 -m pip install git+https://github.com/huggingface/diffusers", gpu="any"
    )
    .pip_install(
        "transformers",
        "scipy",
        "numpy",
        "safetensors",
        "requests",
        "Pillow",
        "opencv-python",
        gpu="any",
    )
    .run_function(
        download_models, gpu="any"
    )
    .pip_install("xformers", gpu="any")
    .run_function(
        download_xl_model, gpu="any"
    )
    .pip_install("scikit-image", "torchvision", gpu="any")
    .run_function(download_segmenter, gpu="any")
)

stub.image = image


@stub.cls(gpu=gpu.A100())
class ImageGenerator:
    def __enter__(self):
        import os

        os.environ["TRANSFORMERS_CACHE"] = cache_path
        os.environ["CUDA_HOME"] = "/usr/local/cuda"

        # from basicsr.archs.rrdbnet_arch import RRDBNet
        from diffusers import (
            StableDiffusionXLControlNetPipeline,
            ControlNetModel,
            EulerAncestralDiscreteScheduler,
        )

        # from realesrgan import RealESRGANer
        from torch import float16, load
        import torch.nn as nn

        euler_a = EulerAncestralDiscreteScheduler.from_pretrained(
            "stabilityai/stable-diffusion-xl-base-1.0", subfolder="scheduler"
        )

        controlnet = ControlNetModel.from_pretrained(
            "diffusers/controlnet-canny-sdxl-1.0",
            torch_dtype=float16,
            variant="fp16",
            local_files_only=True,
        ).to("cuda")

        self.pipe = StableDiffusionXLControlNetPipeline.from_pretrained(
            "stabilityai/stable-diffusion-xl-base-1.0",
            scheduler=euler_a,
            controlnet=controlnet,
            torch_dtype=float16,
            variant="fp16",
            local_files_only=True,
        )

        self.pipe = self.pipe.to("cuda")
        self.pipe.enable_xformers_memory_efficient_attention()

        def build_model(hypar, device):
            net = hypar["model"]  # GOSNETINC(3,1)

            # convert to half precision
            if hypar["model_digit"] == "half":
                net.half()
                for layer in net.modules():
                    if isinstance(layer, nn.BatchNorm2d):
                        layer.float()

            net.to(device)

            if hypar["restore_model"] != "":
                net.load_state_dict(
                    load(
                        hypar["model_path"] + "/" + hypar["restore_model"],
                        map_location=device,
                    )
                )
                net.to(device)
            net.eval()
            return net

        import data_loader_cache
        import models

        ISNetDIS = models.ISNetDIS
        self.normalize = data_loader_cache.normalize
        self.im_preprocess = data_loader_cache.im_preprocess

        # Set Parameters
        self.hypar = {}  # paramters for inferencing

        # load trained weights from this path
        self.hypar["model_path"] = "./saved_models"
        # name of the to-be-loaded weights
        self.hypar["restore_model"] = "isnet-general-use.pth"
        # indicate if activate intermediate feature supervision
        self.hypar["interm_sup"] = False

        # choose floating point accuracy --
        # indicates "half" or "full" accuracy of float number
        self.hypar["model_digit"] = "full"
        self.hypar["seed"] = 0

        # cached input spatial resolution, can be configured into different size
        self.hypar["cache_size"] = [1024, 1024]

        # data augmentation parameters ---
        # mdoel input spatial size, usually use the same value hypar["cache_size"], which means we don't further resize the images
        self.hypar["input_size"] = [1024, 1024]
        # random crop size from the input, it is usually set as smaller than hypar["cache_size"], e.g., [920,920] for data augmentation
        self.hypar["crop_size"] = [1024, 1024]

        self.hypar["model"] = ISNetDIS()

        # Build Model
        self.net = build_model(self.hypar, "cuda")

    @method()
    def generate(
        self,
        prompt: str,
        input_image: bytes,
        num_images: int = 1,
        caption: str = None,
        is_quick_generation: bool = False,
        is_api_request: bool = False,
    ) -> list[bytes]:
        import io
        import subprocess
        import uuid

        import cv2
        import torch
        import numpy as np
        from diffusers.utils import load_image

        images_output = []
        negative_prompt = "ugly, boring, bad anatomy, blurry, pixelated, trees, green, obscure, unnatural colors, poor lighting, dullness, unclear"

        from torch.autograd import Variable
        import torch.nn.functional as F

        # Save the input image to a file
        randomId = str(uuid.uuid4())
        input_img_path = f"{randomId}.png"

        def load_image_internal(im_pil, hypar):
            im = np.array(im_pil)
            im, im_shp = self.im_preprocess(im, hypar["cache_size"])
            im = torch.divide(im, 255.0)
            shape = torch.from_numpy(np.array(im_shp))
            # make a batch of image, shape
            aa = self.normalize(im, [0.5, 0.5, 0.5], [1.0, 1.0, 1.0])
            return aa.unsqueeze(0), shape.unsqueeze(0)

        def segment(image):
            image_tensor, orig_size = load_image_internal(image, self.hypar)
            mask = predict(self.net, image_tensor, orig_size, self.hypar, "cuda")

            mask = PILImage.fromarray(mask).convert("L")
            # Apply thresholding
            threshold_value = 240  # Threshold value (adjust as needed)
            # Apply thresholding
            mask = mask.point(lambda p: p > threshold_value and 255)
            im_rgb = image.convert("RGB")

            cropped = im_rgb.copy()
            cropped.putalpha(mask)

            for ii in range(mask.size[0]):
                for jj in range(mask.size[1]):
                    if mask.getpixel((ii, jj)) == 0:  # Check if the pixel value is 0
                        # Make the pixel in the cropped image transparent
                        cropped.putpixel(
                            (ii, jj), (0, 0, 0, 0)
                        )  # Setting alpha to 0 for transparency

            return [cropped, mask]

        def predict(net, inputs_val, shapes_val, hypar, device):
            """
            Given an Image, predict the mask
            """
            net.eval()

            if hypar["model_digit"] == "full":
                inputs_val = inputs_val.type(torch.FloatTensor)
            else:
                inputs_val = inputs_val.type(torch.HalfTensor)

            inputs_val_v = Variable(inputs_val, requires_grad=False).to(
                device
            )  # wrap inputs in Variable

            ds_val = net(inputs_val_v)[0]  # list of 6 results

            # B x 1 x H x W    # we want the first one which is the most accurate prediction
            pred_val = ds_val[0][0, :, :, :]

            # recover the prediction spatial size to the orignal image size
            pred_val = torch.squeeze(
                F.upsample(
                    torch.unsqueeze(pred_val, 0),
                    (shapes_val[0][0], shapes_val[0][1]),
                    mode="bilinear",
                )
            )

            ma = torch.max(pred_val)
            mi = torch.min(pred_val)
            pred_val = (pred_val - mi) / (ma - mi)  # max = 1

            return (pred_val.detach().cpu().numpy() * 255).astype(np.uint8)

        input_image = PILImage.open(io.BytesIO(input_image))
        input_image = input_image.convert("RGB")
        input_image, _ = segment(input_image)
        input_image = input_image.convert("RGBA")

        if is_api_request:
            print("API Request")
            img = PILImage.new("RGBA", (1024, 1024), (0, 0, 0, 0))
            def crop_transparent(image):
                dummy_image = image.copy()
                if dummy_image.mode != 'RGBA':
                    dummy_image = dummy_image.convert("RGBA")
                bbox = image.getbbox()
                return image.crop(bbox) if bbox else dummy_image
            overlay_image = crop_transparent(input_image)
            min_size = min(overlay_image.size)
            if min_size < 200:
                target_size = 450
            elif min_size < 400:
                target_size = 550
            elif min_size < 600:
                target_size = 625
            else:
                target_size = 700

            scale_factor = min(
                target_size / overlay_image.size[0],
                target_size / overlay_image.size[1],
            )

            overlay_image = overlay_image.resize(
                (
                    int(overlay_image.size[0] * scale_factor),
                    int(overlay_image.size[1] * scale_factor),
                )
            )

            img.paste(
                overlay_image,
                (
                    (img.size[0] - overlay_image.size[0]) // 2,
                    (img.size[1] - overlay_image.size[1]) // 2,
                ),
            )

            img = img.convert("RGBA")
            input_image = img
            
        input_image.save(input_img_path)

        init_image = load_image(input_img_path)
        control_image = np.array(init_image)

        low_threshold = 100
        high_threshold = 200

        control_image = cv2.Canny(control_image, low_threshold, high_threshold)
        control_image = control_image[:, :, None]
        control_image = np.concatenate(
            [control_image, control_image, control_image], axis=2
        )
        control_image = PILImage.fromarray(control_image)

        images = self.pipe(
            prompt=prompt,
            negative_prompt=negative_prompt,
            num_inference_steps=30,
            # generator=torch.manual_seed(888),
            num_images_per_prompt=num_images,
            guidance_scale=7.5,
            image=control_image,
            # clip_skip=2,
            width=init_image.width,
            height=init_image.height,
            eta=1.0,
            # controlnet_conditioning_scale=1.0,
        ).images

        init_image = PILImage.open(input_img_path).convert("RGBA")

        def zoomer(image):
            # Get the dimensions of the original image
            original_width, original_height = image.size
            zoom_factor = 1.03
            new_width = int(original_width * zoom_factor)
            new_height = int(original_height * zoom_factor)
            resized_image = image.resize((new_width, new_height), PILImage.LANCZOS)

            # Calculate crop box coordinates
            crop_left = (new_width - original_width) // 2
            crop_upper = (new_height - original_height) // 2
            crop_right = crop_left + original_width
            crop_lower = crop_upper + original_height

            # Crop the image back to the original size from the center
            cropped_image = resized_image.crop(
                (crop_left, crop_upper, crop_right, crop_lower)
            )

            return cropped_image

        init_image = zoomer(init_image)

        for i in range(num_images):
            with io.BytesIO() as buf:
                # Overlay the original image on images
                images[i].paste(init_image, (0, 0), init_image)

                # Save images as buffer
                images[i].save(buf, format="PNG")
                images_output.append(buf.getvalue())

        return images_output


@stub.local_entrypoint()
def main():
    import requests
    import io

    generator = ImageGenerator()
    link = "https://ik.imagekit.io/7urmiszfde/img_muJW0CR_5.png?tr=orig-true"
    if link:
        inpu_img = requests.get(link).content

        # Convert image to PILImage
        inpu_img = PILImage.open(io.BytesIO(inpu_img))
        # Get image dimensions
        width, height = inpu_img.size
        print("Width: ", width)
        print("Height: ", height)

        # Resize by 0.25x
        inpu_img = inpu_img.resize((int(width * 0.25), int(height * 0.25)))

        print("New Width: ", inpu_img.width)
        print("New Height: ", inpu_img.height)

        # Convert to bytes
        with io.BytesIO() as buf:
            inpu_img.save(buf, format="PNG")
            inpu_img = buf.getvalue()
    else:
        inpu_img = PILImage.open("weights/shoes (1).png")
        inpu_img = inpu_img.convert("RGBA")
        # Convert to bytes
        with io.BytesIO() as buf:
            inpu_img.save(buf, format="PNG")
            inpu_img = buf.getvalue()
    images = generator.generate.remote(
        "Shoes on a podium", inpu_img, 4, "shoes"
    )
    is_dev = False
    for i, image in enumerate(images):
        if is_dev:
            a, b, c = image
        with open(f"out{i}.png", "wb") as f:
            if is_dev:
                f.write(a)
            else:
                f.write(image)
        if is_dev:
            b.save(f"out{i}_mask.png")
            c.save(f"out{i}_diff.png")