FROM node:latest
RUN mkdir /app
WORKDIR /app

COPY package.json /app
RUN npm install

COPY ./src /app/src
COPY ./configs /app/configs
EXPOSE 3000

CMD ["npm", "run", "start"]
