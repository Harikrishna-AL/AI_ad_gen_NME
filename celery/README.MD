There are two folders, one is celery task adder and the other is celery worker, both are dockerized for easy deployment.

The celery task adder is a flask app that adds a task to the celery queue, it receives a post request with a json body that contains the task name and the task arguments, then it adds the task to the celery queue.

The celery worker is a celery worker that runs the task.