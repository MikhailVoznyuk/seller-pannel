FROM node:20.19-alpine

WORKDIR /app

COPY package.json package.json
RUN npm i

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
