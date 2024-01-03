import json
import os
from uuid import uuid4

import requests
from celery import Celery
from flask import Flask, Response, jsonify, request
from flask_swagger_ui import get_swaggerui_blueprint

copilot = Celery(
    "images",
    broker=os.environ["CELERY_BROKER_URL"],
)

# The following function signature is used to create a task, they are not the full function definitions, the full code is present in celery worker
@copilot.task(name="copilot.create_task")
def create_task(
    image: str,
    prompt: str,
    num_images: int,
    api_key: str,
    unique_id: str,
    webhook_url: str = None,
):
    print("image url is", image)


@copilot.task(name="copilot.generate_normal")
def generate_normal(rawJson):
    print("Generate normal")


@copilot.task(name="copilot.regenerate")
def regenerate(rawJson):
    print("regenerate")


@copilot.task(name="copilot.generate_threed")
def generate_threed(rawJson):
    print("generate_threed")


app = Flask(__name__)
app.config["DEBUG"] = True

# A Swagger UI is used to document the API and can be accessed at /api/docs
SWAGGER_URL = "/api/docs"
API_URL = "/static/openapi.json"

swaggerui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={"app_name": "Commerce Copilot"},
)

app.register_blueprint(swaggerui_blueprint)


# Get task result is used to get the result of a task
@app.get("/getTaskResult")
def getTaskResult():
    # Get the request headers
    headers = request.headers

    # Get the request parameters
    params = request.args

    # Get the value of x-api-key in the header
    api_key = headers.get("x-api-key")

    if api_key is None:
        return Response(
            response=json.dumps({"message": "Error, No API Key is Provided"}),
            status=404,
            mimetype="application/json",
        )

    # Get the value of task_id in the params
    task_id = params.get("task_id")

    if task_id is None:
        return Response(
            response=json.dumps({"message": "Error, No Task ID is Provided"}),
            status=404,
            mimetype="application/json",
        )

    # Get the result from database
    result = requests.get(
        f"{os.environ['NEXT_PUBLIC_SUPABASE_URL']}/rest/v1/APIRequests?select=result&task_id=eq.{task_id}",
        headers={
            "apikey": os.environ["SUPABASE_SERVICE_KEY"],
            "Authorization": "Bearer " + os.environ["SUPABASE_SERVICE_KEY"],
            "Content-Type": "application/json",
        },
    )

    if result.status_code == 200:
        return Response(
            response=json.dumps(result.json()[0]["result"]),
            status=200,
            mimetype="application/json",
        )

    return Response(
        response=json.dumps({"message": "Error, Please Try again"}),
        status=500,
        mimetype="application/json",
    )

# Create task is used to create a task and return the task id
@app.post("/createTask")
def create():
    try:
        # Get the request headers
        headers = request.headers

        # Get the request body
        body = request.get_json()

        # Get the value of x-api-key in the header
        api_key = headers.get("x-api-key")

        if api_key is None:
            return Response(
                response=json.dumps(
                    {"message": "Error, No API Key is Provided", "task_id": None}
                ),
                status=404,
                mimetype="application/json",
            )

        # Generate a unique id
        unique_id = uuid4().hex

        # Get the base64 encoded value of the image
        image = body.get("image")

        # Get the value of prompt in the body
        prompt = body.get("prompt")

        # Get the value of num_images in the body
        num_images = body.get("num_images") or 1

        # Get the value of webhook_url in the body
        webhook_url = body.get("webhook_url") or None

        response = Response(
            response=json.dumps({"message": "Success", "task_id": str(unique_id)}),
            status=200,
            mimetype="application/json",
        )

        # @response.call_on_close
        # def process_after_request():
        a = create_task.delay(
            image=image,
            prompt=prompt,
            num_images=num_images,
            api_key=api_key,
            unique_id=unique_id,
            webhook_url=webhook_url,
        )
        print(a)

        # Return a response
        return response
    except Exception as e:
        print(e)
        return Response(
            response=json.dumps({"message": "Error, Please Try again"}),
            status=500,
            mimetype="application/json",
        )

# The generate endpoint is used for the main website to add tasks to the queue
@app.route("/generate", methods=["POST"])
def generate():
    try:
        # Get the request body data
        data = request.get_json()

        # A very basic key based check, to prevent abuse, DDOS, etc.
        verification_key = data["key"]
        if verification_key != os.getenv("KEY"):
            return jsonify({"message": "Server is down 🥹"}), 200

        keys_with_defaults = {
            "prompt": None,
            "image_url": None,
            "user_id": None,
            "num_images": 1,
            "lora_type": None,
            "category": None,
            "caption": None,
            "is_regenerate": False,
            "is_3d": False,
            "project_id": None,
            "is_quick_generation": False,
        }

        rawJson = {
            key: data.get(key, default) for key, default in keys_with_defaults.items()
        }

        function_map = {
            "regenerate": regenerate.delay,
            "3d": generate_threed.delay,
            "default": generate_normal.delay,
        }

        if rawJson["is_regenerate"]:
            result = function_map["regenerate"](rawJson)
        elif rawJson["is_3d"]:
            result = function_map["3d"](rawJson)
        else:
            result = function_map["default"](rawJson)

        # Return a success response
        return jsonify({"message": "Image generation started!", "id": result.id}), 200
    except Exception as e:
        return jsonify({"message": "Image generation failed! " + str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=80, debug=True)
