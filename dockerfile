
FROM nikolaik/python-nodejs:python3.9-nodejs16

WORKDIR /usr/src/app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

#RUN apk --no-cache add add python make g++

COPY package*.json ./
#RUN npm install -g nodemon
COPY . .
RUN npm install
RUN pip install -r ./app/requirements.txt --ignore-installed




EXPOSE 5000
EXPOSE 3000

CMD ["npm", "run", "production"]