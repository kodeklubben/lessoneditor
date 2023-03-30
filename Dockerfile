FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build-all
RUN npm run build-nestbackend


EXPOSE 4200 3012 3333 3000

CMD ["npm", "start"]