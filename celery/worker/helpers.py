import hashlib
import os

import openai
from supabase import Client, create_client
from PIL import Image

NEXT_PUBLIC_IMAGE_TABLE = os.getenv("NEXT_PUBLIC_IMAGE_TABLE")
NEXT_PUBLIC_SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
API_REQUEST_TABLE = os.getenv("API_REQUEST_TABLE")
API_REQUEST_BUCKET = os.getenv("API_REQUEST_BUCKET")
GENERATED_IMAGES_BUCKET = os.getenv("GENERATED_IMAGES_BUCKET")

supabase: Client = create_client(
    NEXT_PUBLIC_SUPABASE_URL,
    os.environ["SUPABASE_SERVICE_KEY"],
)

# We determine the type of model to be used based on the prompt
# We observed that SDXL model works well for podium, stage, platform scenes
# and epicrealism-inpaint-controlnet-indoor model works well for kitchen, bathroom, fridge, refrigerator, washing scenes
# and epicrealism-inpaint-controlnet-general model works well for all other scenes
# All the models are present in modal-code folder for deployment
def determine_model(prompt):
    sdxl_prompts = ["podium", "stage", "platform"]
    epicrealism_inpaint_controlnet_indoor_prompts = [
        "kitchen",
        "bathroom",
        "fridge",
        "refrigerator",
        "washing",
    ]

    if any(word in sdxl_prompts for word in prompt.split()):
        return "sdxl"
    elif any(word in epicrealism_inpaint_controlnet_indoor_prompts for word in prompt.split()):
        return "epicrealism-inpaint-controlnet-indoor"
    else:
        return "epicrealism-inpaint-controlnet-general"


# A function used for uploading the image to supabase storage
def upload_file_to_supabase(bucketName, image, filePath):
    try:
        supabase.storage.from_(bucketName).upload(
            file=image,
            path=filePath,
            file_options={"content-type": "image/png"},
        )
        return True
    except Exception as e:
        print("error", e)
        return False

# Hashing function used to generate a unique hash for the image
def hash(word):
    sha256 = hashlib.sha256()
    sha256.update(word.encode("utf-8"))
    return sha256.hexdigest()

# Function to get the dominant color of the image
def get_dominant_color(pil_img):
    img = pil_img.copy()
    img = img.convert("RGBA")
    img = img.resize((1, 1), resample=0)
    dominant_color = img.getpixel((0, 0))
    return dominant_color


# Function to make a request to Mistral AI 7B and return the response
# There is a custom prompt used and a series of messages to be sent to the model to get the response from the model
def get_chatgpt_response(prompt):
    try:
        openai.api_base = "https://api.fireworks.ai/inference/v1"
        openai.api_key = os.environ["FIREWORKS_API_KEY"]
        chat_completion = openai.ChatCompletion.create(
            model="accounts/fireworks/models/mistral-7b-instruct-4k",
            # The following messages are used to instruct the model to generate a response, they are examples of the kind of messages that the model should generate
            messages=[
                {
                    # This is a system message, it is used to instruct the model to generate a response as per our requirements
                    "role": "system",
                    "content": "You are professional product photographer, your objective is to enhance normal image descriptions to good product photography shot descriptions. If we input a basic scene description, you need to output a detailed, vivid prompt for image generation. Elaborate on the provided prompt for a more detailed and visually evocative description. Add sensory details, context, and emotional elements. Provide clear context and specifics related to the scene, including lighting, setting, and relevant objects. Use descriptive and evocative language to immerse the reader in the described environment. Ensure the enhanced prompt aligns with image generation requirements, considering resolution, style, and thematic compatibility. Send entire prompt as a single sentence without fullstops or line breaks, just use commas. Dont describe much on the product/subject of the image, but rather describe the background in detail",
                },
                # And the following messages are examples of the kind of alternating prompts and responses that the model should generate
                {"role": "user", "content": "Sofa in a luxury living room"},
                {
                    "role": "assistant",
                    "content": "Sofa in a premium, spacious, luxuriously decorated living room with stylish decor, coffee table, classic artwork, and bright natural lighting",
                },
                {"role": "user", "content": "Sofa in a minimal living room"},
                {
                    "role": "assistant",
                    "content": "Sofa in a simple contemporary living room with minimal decor, bright natural lighting",
                },
                {"role": "user", "content": "Chair in a modern office"},
                {
                    "role": "assistant",
                    "content": "Chair in an office with cubicles, muted silver tones, soft lighting, and large windows overlooking a cityscape",
                },
                {"role": "user", "content": "Table in a luxury office space"},
                {
                    "role": "assistant",
                    "content": "Table in a luxurious office space exuding opulence. Envision high ceilings, grand chandeliers, plush leather furniture, and rich wood accents.",
                },
                {"role": "user", "content": "A bed in a Minimal Bedroom"},
                {
                    "role": "assistant",
                    "content": "A bed in an minimal bedroom setting with simple wall, wooden flooring and minor decor",
                },
                {"role": "user", "content": "A bed in a Luxury Bedroom"},
                {
                    "role": "assistant",
                    "content": "A bed in an opulent and lavish bedroom ambiance with stylish decor and clam environment",
                },
                {"role": "user", "content": "coffee table on a high floor balcony"},
                {
                    "role": "assistant",
                    "content": "coffee table on a large balcony of a high rise building, high-end modern furnishing and few plants, overlooking a city sky line, premium outdoor living",
                },
                {"role": "user", "content": "coffee table in a simple balcony"},
                {
                    "role": "assistant",
                    "content": "coffee table on an open air balcony space of a simple and cozy house, minimalistic decor, natural sunlight",
                },
                {"role": "user", "content": "fridge in a kitchen"},
                {
                    "role": "assistant",
                    "content": "A fridge in a modern, well-equipped kitchen, minimum kitchen decor, under-cabinet lighting",
                },
                {"role": "user", "content": "fridge in a minimal kitchen"},
                {
                    "role": "assistant",
                    "content": "A fridge in a simple kitchen, minimalistic, clean, sleek, simple, stripped of excessive decoration",
                },
                {"role": "user", "content": "Washing machine in a laundry room"},
                {
                    "role": "assistant",
                    "content": "washing machine in a cozy household laundry room, surrounded by couple of neatly organized laundry baskets and detergent bottles, epitomizing efficiency and convenience in daily chores",
                },
                {"role": "user", "content": "Sofa in an Indoor Garden Room"},
                {
                    "role": "assistant",
                    "content": "Sofa in an indoor garden oasis, surrounded by lush plants, verdant greenery, cascading vines, bright natural light",
                },
                {"role": "user", "content": "Shoes infront of Waterfall"},
                {
                    "role": "assistant",
                    "content": "Shoes against the backdrop of a mesmerizing waterfall, wooden bridge, lush, vibrant vegetation, natural overcasting light",
                },
                # Here we send the input prompt that we want the model to generate a response for currently
                {"role": "user", "content": prompt},
            ],
            temperature=0.5,
        )
        print("Modified Prompt: ", chat_completion.choices[0].message.content)
        return chat_completion.choices[0].message.content
    except Exception as e:
        print("error", e)
        return None


if __name__ == "__main__":
    print(get_chatgpt_response("A bottle laying on a rock, in a beach"))