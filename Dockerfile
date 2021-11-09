FROM node:16-slim

WORKDIR /usr/src/cryptobot

COPY package.json ./

RUN npm install

COPY . .

CMD ["node", "build/index.js"]
