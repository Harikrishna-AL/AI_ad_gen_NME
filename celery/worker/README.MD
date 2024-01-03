This repo contains code of celery worker, it also contains a Dockerfile for easy deployment.
The worker is responsible for processing the tasks from the queue and updating the database with the results (which the client can then query).

The database schema is provided parent folder to create the database tables.

### Ensure you have environment variables set for the following:

Celery broker url, get from cloudamqp.com or just self host redis/rabbitmq and use that url
- CELERY_BROKER_URL=

Modal keys, get from modal.com
- MODAL_TOKEN_ID=
- MODAL_TOKEN_SECRET=

Fireworks API Key, get from fireworks.ai, used for expanding the prompt, we use mistral ai 7B model on fireworks which is an open source model, and also fireworks is SOC 2 compliant
- FIREWORKS_API_KEY=

Supabase keys, get from supabase.com, or you can even self host supabase on your own server
- SUPABASE_SERVICE_KEY=
- NEXT_PUBLIC_SUPABASE_URL=

Table name in Supabase to store images and also name of storage bucket in supabase where images are stored, feel free to change it, please note that you need to create the tables in supabase for the app to work
- NEXT_PUBLIC_IMAGE_TABLE=public_images
- API_REQUEST_TABLE=api_images
- GENERATED_IMAGES_BUCKET=public_images
