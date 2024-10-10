FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma/
COPY start-server.sh /app/start-server.sh
RUN chmod +x /app/start-server.sh

RUN npm install --legacy-peer-deps

RUN apk update && apk add mysql-client
RUN npm run prisma:generate
# RUN npm run migrate

COPY . .

EXPOSE 8000

CMD ["/bin/sh", "/app/start-server.sh"]