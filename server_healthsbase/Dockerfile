FROM python:3.10.11

# Устанавливаем bash, netcat и утилиту dos2unix
RUN apt-get update && apt-get install -y bash netcat dos2unix

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы зависимостей и устанавливаем их
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Копируем остальной код
COPY . /app/

# Преобразуем скрипт в формат Unix (LF)
RUN dos2unix wait-for-postgres.sh

# Устанавливаем разрешения на выполнение для скрипта
RUN chmod +x wait-for-postgres.sh

# Открываем порт
EXPOSE 8000

# Запускаем скрипт с использованием bash
CMD ["/bin/bash", "./wait-for-postgres.sh"]
