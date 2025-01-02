#!/bin/bash
set -e

# Ожидание, пока контейнер PostgreSQL станет доступен
until nc -z healthsbase_database 5432; do
  echo "Ожидание доступности базы данных..."
  sleep 1
done
python createDatabase.py

# Запускаем FastAPI
exec uvicorn main:app --host 0.0.0.0 --port 8000