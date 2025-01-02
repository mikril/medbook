# Dockerfile для FastAPI сервера
FROM python:3.10.11
RUN apt-get update && apt-get install -y netcat-openbsd
# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы зависимостей и устанавливаем их
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt



# Копируем остальной код
COPY . /app/

# Устанавливаем разрешения на выполнение для скрипта wait-for-postgres.sh
RUN chmod +x wait-for-postgres.sh

# Открываем порт
EXPOSE 8000

# Команда для запуска FastAPI сервера

CMD ["./wait-for-postgres.sh"]