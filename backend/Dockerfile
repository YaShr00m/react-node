# образ Node.js
FROM node:16

# Устанавливаем рабочую директорию
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
