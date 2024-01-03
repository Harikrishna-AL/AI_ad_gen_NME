FROM python:3.10-alpine
RUN pip install --upgrade pip

WORKDIR /app
COPY requirements.txt /app
RUN pip install -r requirements.txt

COPY . /app

CMD ["celery", "-A", "copilot", "worker", "--loglevel=info", "--concurrency=10", "--without-gossip", "--without-mingle", "--without-heartbeat"]