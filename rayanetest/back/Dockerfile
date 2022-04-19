
FROM node:16-alpine3.12
WORKDIR /app/
COPY . .
EXPOSE 3030

ENTRYPOINT ["/bin/sh", "-c", "npm install && npm i -g @nestjs/cli && npm run start:dev"]