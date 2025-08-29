FROM python:3.10-slim

WORKDIR /app

COPY django_react/requirements.txt .
RUN pip install -r requirements.txt

COPY django_react/. .

EXPOSE 9001

CMD ["python", "manage.py", "runserver", "0.0.0.0:9001"]
