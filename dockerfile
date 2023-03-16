FROM node:lts-alpine

WORKDIR /usr/src/app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY package*.json ./
COPY . .
RUN npm install


EXPOSE 5000

CMD ["npm", "run", "start"]