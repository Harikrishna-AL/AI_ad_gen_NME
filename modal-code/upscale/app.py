import base64

from modal import Image, Stub, method, web_endpoint
from PIL import Image as PILImage
from pydantic import BaseModel

stub = Stub("upscale")
cache_path = "/vol/cache"


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
    if not os.path.exists("/vol/cache/RealESRGAN_x2plus.pth"):
        os.makedirs("/vol/cache", exist_ok=True)

    with open("/vol/cache/RealESRGAN_x2plus.pth", "wb") as f:
        f.write(response.content)

    model = RRDBNet(
        num_in_ch=3, num_out_ch=3, num_feat=64, num_block=23, num_grow_ch=32, scale=2
    )
    upsampler = RealESRGANer(
        scale=2,
        model_path="/vol/cache/RealESRGAN_x2plus.pth",
        model=model,
        device="cpu",
    )


image = (
    Image.debian_slim(python_version="3.10")
    .run_commands(
        "apt-get update -y",
        "apt-get install ffmpeg libsm6 libxext6 git -y",
        "apt-get clean && rm -rf /var/lib/apt/lists/*",
    )
    .pip_install("realesrgan", "basicsr>=1.4.2", "requests")
    .run_function(download_upscaler)
)

stub.image = image


@stub.cls(gpu="any")
class ImageGenerator:
    def __enter__(self):
        import os

        os.environ["TRANSFORMERS_CACHE"] = cache_path

        from basicsr.archs.rrdbnet_arch import RRDBNet
        from realesrgan import RealESRGANer

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

    @method()
    def generate(self, input_image: bytes) -> list[bytes]:
        import io

        import cv2
        import numpy as np

        image = PILImage.open(io.BytesIO(input_image)).convert("RGB")
        original_numpy = np.array(image)
        original_opencv = cv2.cvtColor(original_numpy, cv2.COLOR_RGB2BGR)
        output, _ = self.upsampler.enhance(original_opencv, outscale=2)
        image = PILImage.fromarray(cv2.cvtColor(output, cv2.COLOR_BGR2RGB))

        with io.BytesIO() as output:
            image.save(output, format="PNG")
            return {"image": base64.b64encode(output.getvalue()).decode("ascii")}


class Image(BaseModel):
    img: str


@stub.function()
@web_endpoint(method="POST")
def upscale(image: Image):
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
    with open("shoe0.png", "wb") as f:
        f.write(image_bytes)
