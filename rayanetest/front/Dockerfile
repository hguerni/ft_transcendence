FROM node:16-alpine3.12

RUN mkdir -p /app/cache
WORKDIR /app/cache
COPY package.json .
COPY package-lock.json .
RUN npm install -g npm@latest
RUN npm install
RUN mkdir -p node_modules/.cache
ENV NODE_PATH=/app/node_modules/.bin
COPY . .
RUN npm install -g sass
# EXPOSE 3000

# ENTRYPOINT ["npm", "start"]