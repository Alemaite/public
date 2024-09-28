FROM node:20.14.0

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 4200

CMD ["npx", "ng", "serve", "--host", "0.0.0.0"]
