# Используем официальный образ Node.js
FROM node:18

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json, чтобы установить зависимости
COPY package.json package-lock.json /app/

# Устанавливаем зависимости с использованием npm ci (более детерминированный процесс)
RUN npm ci

# Копируем остальные файлы приложения
COPY . /app/

# Открываем порт, на котором будет работать приложение (обычно React по умолчанию использует 3000)
EXPOSE 8081

# Команда для запуска приложения
CMD ["npm", "start"]
