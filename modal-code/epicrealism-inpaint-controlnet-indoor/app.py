import io
from modal import Image, Stub, method
from PIL import Image as PILImage

stub = Stub("epicrealism-inpaint-controlnet-indoor")
cache_path = "/vol/cache"

# The following are LORA embeddings which enhance the image quality, all of them work by making sure that the image doesn't converge to a bad image, by placing the embedding in generation's negative prompt
embeddings_list = [
    {
        "filename": "easynegative.safetensors",
        "link": "https://civitai.com/api/download/models/9208?type=Model&format=SafeTensor&size=full&fp=fp16",
        "keyword": "EasyNegative",
    },
    {
        "filename": "deepnegative.pt",
        "link": "https://civitai.com/api/download/models/5637?type=Model&format=PickleTensor&size=full&fp=fp16",
        "keyword": "ng_deepnegative_v1_75t",
    },
    {
        "filename": "bad.pt",
        "link": "https://civitai.com/api/download/models/60095?type=Negative&format=Other",
        "keyword": "bad_prompt_version2",
    },
    {
        "filename": "epicphotogasmnegative.pt",
        "link": "https://civitai.com/api/download/models/145996?type=Negative&format=Other",
        "keyword": "epiCPhotoGasm-colorfulPhoto-neg",
    },
    {
        "filename": "veryBadImageNegative.pt",
        "link": "https://civitai.com/api/download/models/25820?type=Model&format=PickleTensor&size=full&fp=fp16",
        "keyword": "verybadimagenegative_v1.3",
    }
]

def download_upscaler():
    import os

    os.environ["TRANSFORMERS_CACHE"] = cache_path

    import requests
    from basicsr.archs.rrdbnet_arch import RRDBNet
    from realesrgan import RealESRGANer

    response = requests.get(
        "https://github.com/xinntao/Real-ESRGAN/releases/download/v0.2.1/RealESRGAN_x2plus.pth",
        stream=True,
    )
    with open("/vol/cache/RealESRGAN_x2plus.pth", "wb") as f:
        f.write(response.content)

    model = RRDBNet(
        num_in_ch=3, num_out_ch=3, num_feat=64, num_block=23, num_grow_ch=32, scale=2
    )
    RealESRGANer(
        scale=2,
        model_path="/vol/cache/RealESRGAN_x2plus.pth",
        model=model,
        device="cpu",
    )


def download_models():
    import os

    import requests
    from diffusers import DPMSolverMultistepScheduler, StableDiffusionInpaintPipeline
    from diffusers.models import AutoencoderKL
    from torch import float16

    vae = AutoencoderKL.from_pretrained(
        "stabilityai/sd-vae-ft-mse",
        cache_dir=cache_path + "/vae",
        torch_dtype=float16,
    )

    for embedding in embeddings_list:
        response = requests.get(
            embedding["link"],
            stream=True,
        )

        # Save the file to cache
        with open(os.path.join(cache_path, embedding["filename"]), "wb") as f:
            for chunk in response.iter_content(chunk_size=1024):
                f.write(chunk)

    pipe = StableDiffusionInpaintPipeline.from_pretrained(
        "dhanushreddy29/EpicRealismInpaint",
        vae=vae,
        torch_dtype=float16,
        cache_dir=cache_path + "/inpaint",
        # safety_checker=None,
    )

    pipe.scheduler = DPMSolverMultistepScheduler.from_config(
        pipe.scheduler.config, use_karras_sigmas=True
    )


def download_sam_models():
    import os

    os.environ["CUDA_HOME"] = "/usr/local/cuda"
    os.environ["TRANSFORMERS_CACHE"] = cache_path

    import requests
    from diffusers import ControlNetModel
    from torch import float16

    ControlNetModel.from_pretrained(
        "lllyasviel/sd-controlnet-canny",
        torch_dtype=float16,
        cache_dir=cache_path + "/controlnet",
    )

    file = requests.get(
        "https://raw.githubusercontent.com/dhanushreddy291/lang-segment-anything/main/lang_sam.py"
    )

    with open("lang_sam.py", "wb") as f:
        f.write(file.content)

    from lang_sam import LangSAM

    model = LangSAM()

    image_pil = PILImage.open(
        requests.get(
            "https://ik.imagekit.io/lkrvcrvnx/1_mEaa4G8_h.png?updatedAt=1695649335303&tr=orig-true",
            stream=True,
        ).raw
    )
    text_prompt = "shoes"
    masks, boxes, phrases, logits = model.predict(image_pil, text_prompt)


def download_segmenter():
    import os

    os.environ["TRANSFORMERS_CACHE"] = cache_path
    import torch
    import torch.nn as nn
    from huggingface_hub import hf_hub_download

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

    device = "cpu"
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

        net.to("cpu")

        if hypar["restore_model"] != "":
            net.load_state_dict(
                torch.load(
                    hypar["model_path"] + "/" + hypar["restore_model"],
                    map_location="cpu",
                )
            )
            net.to("cpu")
        net.eval()
        return net

    # Build Model
    net = build_model(hypar, "cpu")


image = (
    Image.from_registry(
        # NVIDIA CUDA image is used as the base image
        "nvidia/cuda:12.1.0-cudnn8-runtime-ubuntu22.04", add_python="3.10"
    )
    .run_commands(
        # Install dependencies via apt-get
        "apt-get update && apt-get install git ffmpeg build-essential cargo curl libsm6 libxext6 rustc software-properties-common unzip -y",
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
    # Segment Anything Model from Meta is installed
    .run_commands(
        "git clone https://github.com/facebookresearch/segment-anything.git && cd segment-anything && python3 -m pip install --upgrade -e . && cd ..",
        "pip install groundingdino-py",
        gpu="any",
    )
    .run_function(
        download_models, gpu="any"
    )
    .pip_install(
        "torch",
        "huggingface-hub",
        "Pillow",
        "scikit-image",
        "torchvision",
        gpu="any",
    )
    .run_function(download_segmenter, gpu="any")
    .run_function(download_sam_models, gpu="any")
    .pip_install("realesrgan", "basicsr>=1.4.2", gpu="any")
    .run_function(download_upscaler, gpu="any")
    .pip_install("xformers", gpu="any")
)

stub.image = image


@stub.cls(gpu="any")
class ImageGenerator:
    def __enter__(self):
        import os

        os.environ["CUDA_HOME"] = "/usr/local/cuda"
        os.environ["TRANSFORMERS_CACHE"] = cache_path

        import torch.nn as nn
        from diffusers import (
            ControlNetModel,
            DPMSolverMultistepScheduler,
            StableDiffusionControlNetInpaintPipeline,
        )
        from diffusers.models import AutoencoderKL
        from realesrgan import RealESRGANer
        from basicsr.archs.rrdbnet_arch import RRDBNet
        from lang_sam import LangSAM
        from torch import float16, load

        vae = AutoencoderKL.from_pretrained(
            "stabilityai/sd-vae-ft-mse",
            cache_dir=cache_path + "/vae",
            torch_dtype=float16,
        )

        self.lang_sam_model = LangSAM()

        controlnet = ControlNetModel.from_pretrained(
            "lllyasviel/sd-controlnet-canny",
            torch_dtype=float16,
            cache_dir=cache_path + "/controlnet",
            local_files_only=True,
        )

        self.pipe = StableDiffusionControlNetInpaintPipeline.from_pretrained(
            "dhanushreddy29/EpicRealismInpaint",
            vae=vae,
            controlnet=controlnet,
            torch_dtype=float16,
            cache_dir=cache_path + "/inpaint",
            local_files_only=True,
        ).to("cuda")

        self.pipe.scheduler = DPMSolverMultistepScheduler.from_config(
            self.pipe.scheduler.config, use_karras_sigmas=True
        )

        self.pipe.enable_xformers_memory_efficient_attention()

        model = RRDBNet(
            num_in_ch=3,
            num_out_ch=3,
            num_feat=64,
            num_block=23,
            num_grow_ch=32,
            scale=2,
        )

        self.upsampler = RealESRGANer(
            scale=2,
            model_path="/vol/cache/RealESRGAN_x2plus.pth",
            model=model,
            device="cuda",
        )

        for embedding in embeddings_list:
            self.pipe.load_textual_inversion(
                cache_path,
                weight_name=embedding["filename"],
                token=embedding["keyword"],
            )

        def build_model(hypar, device):
            net = hypar["model"]  # GOSNETINC(3,1)

            # convert to half precision
            if hypar["model_digit"] == "half":
                net.half()
                for layer in net.modules():
                    if isinstance(layer, nn.BatchNorm2d):
                        layer.float()

            net.to("cuda")

            if hypar["restore_model"] != "":
                net.load_state_dict(
                    load(
                        hypar["model_path"] + "/" + hypar["restore_model"],
                        map_location="cuda",
                    )
                )
                net.to("cuda")
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

    def convert_alpha_to_black_white(self, image_path, should_invert=False):
        import numpy as np

        # Read image
        img = PILImage.open(image_path)

        # Convert image to RGBA mode (with alpha channel)
        img = img.convert("RGBA")

        # Convert image to numpy array
        img_array = np.array(img)

        # Extract alpha channel
        alpha = img_array[:, :, 3]

        # Create a mask where alpha is 0
        mask = alpha == 0

        if should_invert:
            img_array[mask] = [0, 0, 0, 255]
            img_array[~mask] = [255, 255, 255, 255]
        else:
            # Set the RGB channels to white (255) for pixels with alpha 0
            img_array[mask] = [255, 255, 255, 255]
            # Set the RGB channels to black (0) for pixels with alpha > 0
            img_array[~mask] = [0, 0, 0, 255]

        # Convert numpy array back to image
        bw_img = PILImage.fromarray(img_array)

        return bw_img

    @method()
    def generate(
        self, prompt: str, input_image: bytes, num_images: int = 1, caption: str = ""
    ) -> list[bytes]:
        import io
        import uuid

        import cv2
        import numpy as np
        from diffusers.utils import load_image
        from torch import cat

        def get_pipeline_embeds(pipeline, prompt, negative_prompt, device):
            """Get pipeline embeds for prompts bigger than the maxlength of the pipe
            :param pipeline:
            :param prompt:
            :param negative_prompt:
            :param device:
            :return:
            """
            max_length = pipeline.tokenizer.model_max_length

            # Calculate the number of tokens for each prompt
            count_prompt = len(pipeline.tokenizer.tokenize(prompt))
            count_negative_prompt = len(pipeline.tokenizer.tokenize(negative_prompt))

            # Determine the maximum length between the prompts
            shape_max_length = max(count_prompt, count_negative_prompt)

            # Tokenize and pad/truncate the input prompts to the maximum length
            input_ids = pipeline.tokenizer(
                prompt,
                return_tensors="pt",
                truncation=True,
                padding="max_length",
                max_length=shape_max_length,
            ).input_ids.to(device)

            negative_ids = pipeline.tokenizer(
                negative_prompt,
                return_tensors="pt",
                truncation=True,
                padding="max_length",
                max_length=shape_max_length,
            ).input_ids.to(device)

            concat_embeds = []
            neg_embeds = []
            for i in range(0, shape_max_length, max_length):
                concat_embeds.append(
                    pipeline.text_encoder(input_ids[:, i : i + max_length])[0]
                )
                neg_embeds.append(
                    pipeline.text_encoder(negative_ids[:, i : i + max_length])[0]
                )

            return cat(concat_embeds, dim=1), cat(neg_embeds, dim=1)

        images_output = []
        negative_prompt = "EasyNegative, ng_deepnegative_v1_75t, bad_prompt_version2, epiCPhotoGasm-colorfulPhoto-neg, FastNegativeV2"
        prompt_embeds, negative_prompt_embeds = get_pipeline_embeds(
            self.pipe, prompt, negative_prompt, "cuda"
        )

        # Save the input image to a file
        randomId = str(uuid.uuid4())
        input_img_path = f"{randomId}.png"

        with open(input_img_path, "wb") as f:
            f.write(input_image)

        import numpy as np
        import torch
        import torch.nn.functional as F
        from torch.autograd import Variable

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
                "cuda"
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

            if device == "cuda":
                torch.cuda.empty_cache()
            # it is the mask we need
            return (pred_val.detach().cpu().numpy() * 255).astype(np.uint8)

        input_image = PILImage.open(io.BytesIO(input_image))
        original_dims = input_image.size
        input_image = input_image.convert("RGB")
        input_image, _ = segment(input_image)
        input_image = input_image.convert("RGBA")
        original_init_image = input_image.copy()
        input_image = input_image.resize(
            (int(original_dims[0] * 0.5), int(original_dims[1] * 0.5))
        )
        input_image.save(input_img_path)
        init_image = load_image(input_img_path)

        mask_image = self.convert_alpha_to_black_white(input_img_path)
        control_image = load_image(input_img_path)
        control_image = np.array(control_image)

        low_threshold = 100
        high_threshold = 200

        control_image = cv2.Canny(control_image, low_threshold, high_threshold)
        control_image = control_image[:, :, None]
        control_image = np.concatenate(
            [control_image, control_image, control_image], axis=2
        )
        control_image = PILImage.fromarray(control_image)

        images = self.pipe(
            prompt_embeds=prompt_embeds,
            negative_prompt_embeds=negative_prompt_embeds,
            num_inference_steps=40,
            num_images_per_prompt=num_images,
            guidance_scale=15,
            image=init_image,
            mask_image=mask_image,
            control_image=control_image,
            controlnet_conditioning_scale=1.0,
            # generator=torch.manual_seed(334),
            # clip_skip=2,
            width=init_image.width,
            height=init_image.height,
            eta=1.0,
        ).images

        init_image = PILImage.open(input_img_path).convert("RGBA")

        if caption is not None:
            modified_images_output = []
            true_image_array = np.array(
                self.convert_alpha_to_black_white(
                    input_img_path, should_invert=True
                ).convert("L")
            )
            for image in images:
                masks, _, _, _ = self.lang_sam_model.predict(image, caption)
                if len(masks) > 0:
                    masks_tuple = tuple(masks)
                    masks_tensor = torch.stack(masks_tuple, dim=0)
                    result_mask, _ = torch.max(masks_tensor, dim=0)
                    masks_int = np.array(result_mask).astype(int)
                    masks_scaled = masks_int * 255

                    diff_array = masks_scaled - true_image_array
                    diff_array[diff_array < 0] = 0
                    second_mask_image = PILImage.fromarray(diff_array.astype(np.uint8))

                    # Generate new image with second mask
                    modified_image = self.pipe(
                        prompt="background, smooth edges, proper blending",
                        negative_prompt=caption
                        + ",uneven blending, Jagged edges,Rough edges,Uneven edges,Ragged edges,Irregular edges,Bumpy edges,Coarse edges,Sharp edges,Abrasive edges,Broken edges",
                        num_inference_steps=10,
                        num_images_per_prompt=1,
                        guidance_scale=15,
                        image=image,
                        mask_image=second_mask_image,
                        control_image=control_image,
                        controlnet_conditioning_scale=1.0,
                        width=image.width,
                        height=image.height,
                        eta=1.0,
                    ).images[0]

                    modified_images_output.append(modified_image)
            images = (
                modified_images_output if len(modified_images_output) > 0 else images
            )

        def zoomer(image):
            # Get the dimensions of the original image
            original_width, original_height = image.size
            zoom_factor = 1.01
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

        original_init_image = zoomer(original_init_image)

        for i in range(len(images)):
            with io.BytesIO() as buf:
                original_numpy = np.array(images[i])
                original_opencv = cv2.cvtColor(original_numpy, cv2.COLOR_RGB2BGR)
                output, _ = self.upsampler.enhance(original_opencv, outscale=2)
                images[i] = PILImage.fromarray(cv2.cvtColor(output, cv2.COLOR_BGR2RGB))
                images[i].paste(original_init_image, (0, 0), original_init_image)
                images[i].save(buf, format="PNG")
                images_output.append(buf.getvalue())

        return images_output


@stub.local_entrypoint()
def main():
    import requests

    generator = ImageGenerator()
    inpu_img = PILImage.open(requests.get("https://tvjjvhjhvxwpkohjqxld.supabase.co/storage/v1/object/public/request_images/0f80a0d8-e001-4938-9f07-2ec9dfc64456/159ab667-28b3-474e-93fe-4e6a98f864af.png", stream=True).raw)
    with io.BytesIO() as buf:
        inpu_img.save(buf, format="PNG")
        inpu_img = buf.getvalue()
    images = generator.generate.remote(
        "Washing Machine in a modern, well-equipped kitchen, minimum kitchen decor, under-cabinet lighting", inpu_img, 4, "Washing Machine"
    )
    for i, image in enumerate(images):
        with open(f"shoen{i}.png", "wb") as f:
            f.write(image)
