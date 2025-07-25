FROM node:22-alpine

RUN apk add --no-cache python3 make g++
RUN npm install -g @nestjs/cli

WORKDIR /app

COPY package*.json .
COPY prisma ./prisma/

COPY . .

RUN npm install

EXPOSE 3000

# Script de inicio personalizado
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]
