FROM node:22-alpine

RUN apk add --no-cache python3 make g++ 

WORKDIR /app

COPY package*.json .
COPY prisma ./prisma/

COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
