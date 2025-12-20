FROM python:3.11-slim
WORKDIR /app
# Prvo kopiramo requirements da iskoristimo Docker cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
# Tek onda kopiramo ostatak koda
COPY . .
CMD ["python", "app.py"]

