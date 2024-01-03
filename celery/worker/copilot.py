import json
import os
from io import BytesIO

import modal
import requests
from celery import Celery
from PIL import Image
from supabase import Client, create_client

import hashlib
import subprocess

from helpers import (
    NEXT_PUBLIC_IMAGE_TABLE,
    GENERATED_IMAGES_BUCKET,
    NEXT_PUBLIC_SUPABASE_URL,
    API_REQUEST_BUCKET,
    API_REQUEST_TABLE,
    determine_model,
    get_chatgpt_response,
    upload_file_to_supabase,
)

supabase: Client = create_client(
    NEXT_PUBLIC_SUPABASE_URL,
    os.environ["SUPABASE_SERVICE_KEY"],
)

app = Celery(
    "images",
    broker=os.environ["CELERY_BROKER_URL"],
)


@app.task()
def generate_normal(rawJson):
    try:
        prompt = rawJson["prompt"]
        image_url = rawJson["image_url"]
        num_images = rawJson["num_images"]
        caption = rawJson["caption"]
        user_id = rawJson["user_id"]

        is_quick_generation = (
            rawJson["is_quick_generation"]
            if "is_quick_generation" in rawJson
            else False
        )

        # Get the celery task id
        task_id = str(generate_normal.request.id)
        path = os.path.join("/tmp", task_id)
        if not os.path.exists(path):
            os.makedirs(path)

        image_response = requests.get(image_url).content
        image_response = Image.open(BytesIO(image_response))

        with BytesIO() as buf:
            image_response.save(buf, "PNG")
            image_response = buf.getvalue()

        if len(image_url) < 1000:
            print("Image url is: ", image_url)
        else:
            print("A Base 64 image is sent")

        prompt = caption + " " + prompt
        prompt = prompt.strip()
        print("Original Prompt is: ", prompt)
        if len(prompt) < 50:
            response = get_chatgpt_response(prompt)
            if response is not None:
                prompt = response

        print("Modified Prompt is: ", prompt)
        model_used = determine_model(prompt)

        # Call modal to generate the images
        f = modal.Function.lookup(
            model_used,
            "ImageGenerator.generate",
        )

        args = [prompt, image_response, num_images]
        if model_used != "epicrealism-inpaint-controlnet-indoor":
            args.extend([caption, is_quick_generation])

        images = f.remote(*args)
        number_of_images = len(images)

        original_file_urls = []

        for i in range(number_of_images):
            try:
                uploadToSupabase = upload_file_to_supabase(
                    bucketName=GENERATED_IMAGES_BUCKET,
                    image=images[i],
                    filePath=f"{task_id}/{i}.png",
                )
                if uploadToSupabase:
                    original_file_urls.append(
                        f"{NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/{GENERATED_IMAGES_BUCKET}/{task_id}/{i}.png"
                    )
            except Exception as e:
                print("Exception catched error is: ", e)
                pass

        # Insert into the supabase database
        response = requests.post(
            f"{NEXT_PUBLIC_SUPABASE_URL}/rest/v1/{NEXT_PUBLIC_IMAGE_TABLE}",
            headers={
                "apikey": os.getenv("SUPABASE_SERVICE_KEY"),
                "Authorization": f"Bearer {os.getenv('SUPABASE_SERVICE_KEY')}",
                "Content-Type": "application/json",
            },
            data=json.dumps(
                [
                    {
                        "image_url": image_url,
                        "modified_image_url": original_file_urls[i],
                        "prompt": prompt,
                        "user_id": user_id,
                        "task_id": task_id,
                        "caption": caption,
                        "is_quick": is_quick_generation,
                        "project_id": rawJson["project_id"],
                    }
                    for i in range(number_of_images)
                ]
            ),
        )

        print("Normal DB response is: ", response.json())
        print("Generated Image URL's are:", original_file_urls)
    except Exception as e:
        print("Error is: ", e)
        pass


@app.task()
def generate_threed(rawJson):
    try:
        prompt = rawJson["prompt"]
        image_url = rawJson["image_url"]
        num_images = rawJson["num_images"]
        caption = rawJson["caption"]
        user_id = rawJson["user_id"]

        # Get the celery task id
        task_id = str(generate_threed.request.id)

        image_response = requests.get(image_url).content
        image_response = Image.open(BytesIO(image_response))

        height, width = image_response.size

        # Resize the image down by 1.5x
        image_response = image_response.resize(
            (int(height / 1.5), int(width / 1.5)), Image.Resampling.LANCZOS
        )

        with BytesIO() as buf:
            image_response.save(buf, "PNG")
            image_response = buf.getvalue()

        prompt = caption + " " + prompt
        prompt = prompt.strip()

        print("Original Prompt is: ", prompt)

        if len(prompt) < 50:
            response = get_chatgpt_response(prompt)
            if response is not None:
                prompt = response

        print("Modified Prompt is: ", prompt)
        if len(image_url) < 1000:
            print("Image url is: ", image_url)
        else:
            print("A Base 64 image is sent")

        model_used = determine_model(prompt)
        # Call modal to generate the images
        f = modal.Function.lookup(
            model_used,
            "ImageGenerator.generate",
        )

        args = [prompt, image_response, num_images]
        if model_used != "epicrealism-inpaint-controlnet-indoor":
            args.extend([caption])

        images = f.remote(*args)

        # Save the images to a temporary directory
        number_of_images = len(images)

        original_file_urls = []
        for i in range(number_of_images):
            uploadToSupabase = upload_file_to_supabase(
                bucketName=GENERATED_IMAGES_BUCKET,
                image=images[i],
                filePath=f"{task_id}/{i}.png",
            )
            if uploadToSupabase:
                original_file_urls.append(
                    f"{NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/{GENERATED_IMAGES_BUCKET}/{task_id}/{i}.png"
                )

        # Insert into the supabase database
        response = requests.post(
            f"{NEXT_PUBLIC_SUPABASE_URL}/rest/v1/{NEXT_PUBLIC_IMAGE_TABLE}",
            headers={
                "apikey": os.getenv("SUPABASE_SERVICE_KEY"),
                "Authorization": f"Bearer {os.getenv('SUPABASE_SERVICE_KEY')}",
                "Content-Type": "application/json",
            },
            data=json.dumps(
                [
                    {
                        "image_url": image_url,
                        "modified_image_url": original_file_urls[i],
                        "prompt": prompt,
                        "user_id": user_id,
                        "task_id": task_id,
                        "caption": caption,
                        "is_3d": True,
                        "project_id": None,
                    }
                    for i in range(number_of_images)
                ]
            ),
        )

        print("Threed DB response is: ", response.json())
        print("Generated Image URL's are:", original_file_urls)
    except Exception as e:
        print("Error is: ", e)
        pass


@app.task()
def regenerate(rawJson):
    try:
        image_url = rawJson["image_url"]
        user_id = rawJson["user_id"]

        # Get the celery task id
        task_id = str(regenerate.request.id)

        # Get the prompt and caption from the database
        response = requests.get(
            f"{NEXT_PUBLIC_SUPABASE_URL}/rest/v1/{NEXT_PUBLIC_IMAGE_TABLE}?modified_image_url=eq.{image_url}",
            headers={
                "apikey": os.getenv("SUPABASE_SERVICE_KEY"),
                "Authorization": f"Bearer {os.getenv('SUPABASE_SERVICE_KEY')}",
                "Content-Type": "application/json",
            },
        )

        response = response.json()
        prompt = response[0]["prompt"]
        caption = response[0]["caption"]
        user_id = response[0]["user_id"]
        image_url = response[0]["image_url"]
        project_id = response[0]["project_id"]

        image_response = requests.get(image_url).content
        image_response = Image.open(BytesIO(image_response))

        with BytesIO() as buf:
            image_response.save(buf, "PNG")
            image_response = buf.getvalue()

        model_used = determine_model(prompt)

        # Call modal to generate the images
        f = modal.Function.lookup(
            model_used,
            "ImageGenerator.generate",
        )

        args = [prompt, image_response, 3]
        if model_used != "epicrealism-inpaint-controlnet-indoor":
            args.extend([caption])

        images = f.remote(*args)

        # Save the images to a temporary directory
        number_of_images = len(images)
        original_file_urls = []
        for i in range(number_of_images):
            uploadToSupabase = upload_file_to_supabase(
                bucketName=GENERATED_IMAGES_BUCKET,
                image=images[i],
                filePath=f"{task_id}/{i}.png",
            )
            if uploadToSupabase:
                original_file_urls.append(
                    f"{NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/{GENERATED_IMAGES_BUCKET}/{task_id}/{i}.png"
                )

        # Insert into the supabase database
        response = requests.post(
            f"{NEXT_PUBLIC_SUPABASE_URL}/rest/v1/{NEXT_PUBLIC_IMAGE_TABLE}",
            headers={
                "apikey": os.getenv("SUPABASE_SERVICE_KEY"),
                "Authorization": f"Bearer {os.getenv('SUPABASE_SERVICE_KEY')}",
                "Content-Type": "application/json",
            },
            data=json.dumps(
                [
                    {
                        "image_url": image_url,
                        "modified_image_url": original_file_urls[i],
                        "prompt": prompt,
                        "user_id": user_id,
                        "task_id": task_id,
                        "caption": caption,
                        "is_3d": False,
                        "is_regenerated": True,
                        "project_id": project_id,
                    }
                    for i in range(number_of_images)
                ]
            ),
        )

        print("Regenerate DB response is: ", response.json())
        print("Generated Image URL's are:", original_file_urls)
    except Exception as e:
        print("Error is: ", e)
        pass


@app.task
def create_task(
    image: str,
    prompt: str,
    num_images: int,
    api_key: str,
    unique_id: str,
    webhook_url: str = None,
):
    try:
        # Check if api_key is valid
        hashed_key = hashlib.sha256(api_key.encode()).hexdigest()

        # Check it in the database
        result = (
            supabase.rpc(
                "check_api_key_and_credits",
                {"api_key_arg": hashed_key, "task_id_arg": unique_id},
            )
            .execute()
            .model_dump()
        )

        should_process = result["data"][0]["should_process"]

        if should_process:
            image_urls = []
            path = os.path.join("/tmp", unique_id)
            if not os.path.exists(path):
                os.makedirs(path)
            if webhook_url:
                print("Image URL was: ", image)
                image_as_bytes = requests.get(image, stream=True).content

                model_used = determine_model(prompt)

                f = modal.Function.lookup(
                    model_used,
                    "ImageGenerator.generate",
                )

                caption = prompt.split(",")[0]
                caption = caption.replace('"', "").strip()

                if len(prompt) < 50:
                    response = get_chatgpt_response(prompt.strip())
                    if response is not None:
                        prompt = response

                print("Prompt, Caption: ", prompt, caption)

                args = [prompt, image_as_bytes, num_images]
                if model_used != "epicrealism-inpaint-controlnet-indoor":
                    args.extend([caption, False, True])

                images = f.remote(*args)

                # Save the images to a temporary directory
                number_of_images = len(images)
                for i, image in enumerate(images):
                    supabase.storage.from_(API_REQUEST_BUCKET).upload(
                        file=image,
                        path=f"/{unique_id}/{i}.png",
                        file_options={"content-type": "image/png"},
                    )

                # Upload the image to Supabase Storage
                image_urls = [
                    f"{NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/{API_REQUEST_BUCKET}/{unique_id}/{i}.png"
                    for i in range(number_of_images)
                ]

                print("Output Image URLs: ", image_urls)

                # Delete the temporary directory
                subprocess.run(["rm", "-rf", path])
                requests.post(
                    webhook_url,
                    json={
                        "message": "success",
                        "image_url": image_urls,
                    },
                    headers={
                        "Content-Type": "application/json",
                        "User-Agent": "CommerceCopilotv1.0",
                    },
                )

            requests.patch(
                f"{NEXT_PUBLIC_SUPABASE_URL}/rest/v1/{API_REQUEST_TABLE}?task_id=eq.{unique_id}",
                json={"result": image_urls},
                headers={
                    "apikey": os.getenv("SUPABASE_SERVICE_KEY"),
                    "Authorization": "Bearer " + os.getenv("SUPABASE_SERVICE_KEY"),
                    "Content-Type": "application/json",
                },
            )

            print("Image URLs: ", image_urls)
        else:
            if webhook_url:
                # Send a POST request to the webhook_url
                requests.post(
                    webhook_url,
                    json={
                        "message": "failed",
                        "image_url": None,
                        "reason": "Your API Key is invalid",
                    },
                    headers={
                        "Content-Type": "application/json",
                        "User-Agent": "CommerceCopilotv1.0",
                    },
                )
            # Update the status of the task in the database
            supabase.table(API_REQUEST_TABLE).update(
                {"result": ["Failed! Your API Key is invalid"]}
            ).eq("task_id", unique_id).execute()

    except Exception as e:
        print(e)
        return
