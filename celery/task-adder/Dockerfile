FROM python:3.10-alpine
RUN mkdir /app
WORKDIR /app
ADD requirements.txt /app
RUN pip install --upgrade pip
RUN pip install --upgrade -r requirements.txt
ADD . /app
EXPOSE 80
RUN chmod +x ./entrypoint.sh
ENTRYPOINT ["sh", "entrypoint.sh"]