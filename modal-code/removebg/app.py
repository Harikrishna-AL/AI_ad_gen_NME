import base64

from modal import Image, Stub, method, web_endpoint
from PIL import Image as PILImage
from pydantic import BaseModel

stub = Stub("bgremove")
cache_path = "/vol/cache"


def download_segmenter():
    import os

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
    Image.debian_slim(python_version="3.10")
    .run_commands(
        "apt-get update -y",
        "apt-get install ffmpeg libsm6 libxext6 git -y",
        "apt-get clean && rm -rf /var/lib/apt/lists/*",
    )
    .pip_install(
        "torch",
        "opencv-python",
        "huggingface-hub",
        "Pillow",
        "scikit-image",
        "torchvision",
    )
    .run_function(download_segmenter)
)

stub.image = image


@stub.cls(gpu="any")
class ImageGenerator:
    def __enter__(self):
        import os

        import torch.nn as nn
        from torch import load

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

    @method()
    def generate(self, input_image: bytes) -> list[bytes]:
        import io

        import cv2
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
        input_image = input_image.convert("RGB")
        input_image, _ = segment(input_image)
        input_image = input_image.convert("RGBA")

        image_bytes = io.BytesIO()
        input_image.save(image_bytes, format="PNG")
        image_bytes = image_bytes.getvalue()

        # Encode the bytes to base64
        base64string = base64.b64encode(image_bytes).decode("utf-8")
        return {"image": base64string}


class Image(BaseModel):
    img: str


@stub.function()
@web_endpoint(method="POST")
def removebg(image: Image):
    # Convert to bytes
    import base64

    image.img = base64.b64decode(
        image.img if not image.img.startswith("data") else image.img.split(",")[1]
    )
    return ImageGenerator().generate.remote(image.img)


@stub.local_entrypoint()
def main():
    import requests

    generator = ImageGenerator()
    input_img = requests.get(
        "https://res.cloudinary.com/dmkarf8ed/image/fetch/v1697201359/https://s3.us-west-004.backblazeb2.com/commerce-copilot/c361616d-0cf7-4067-9b78-3b82f0322b09/original_image/0.png"
    ).content

    response = generator.generate.remote(input_img)
    base64string = response["image"]

    # Decode the base64 string
    image_bytes = base64.b64decode(base64string)

    # Write the image to a file
    with open("out.png", "wb") as f:
        f.write(image_bytes)
