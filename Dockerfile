# Этап 1: сборка React-приложения
FROM node:22-alpine AS build

# Установка рабочей директории
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Установка зависимостей
RUN npm install

# Копируем исходники и собираем приложение
COPY . .
RUN npm run build

# Этап 2: продакшн сервер на nginx
FROM nginx:alpine

# Удалим стандартный конфиг nginx
RUN rm /etc/nginx/conf.d/default.conf

# Копируем наш кастомный конфиг nginx
COPY nginx.conf /etc/nginx/conf.d

# Копируем собранное React-приложение из предыдущего этапа
COPY --from=build /app/dist /usr/share/nginx/html

# Экспонируем порт
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
