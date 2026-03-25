FROM node:20.19-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm i

COPY . .

EXPOSE 8080

CMD ["npm", "run", "start"]
