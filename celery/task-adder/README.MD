This is a celery task adder, written in flask, it receives requests via HTTP from Frontend of the website and adds tasks to the queue, to be picked up the celery worker.

Ensure following environment variables are set before running the server:
 - CELERY_BROKER_URL="#Celery Broker URL/Redis URL/RabbitMQ URL"
 - KEY="abcd" #Key for checking if request are coming from our website, basic request validation