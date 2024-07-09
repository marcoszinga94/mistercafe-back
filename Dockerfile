FROM node:20.15.0
WORKDIR /usr/src
COPY package*.json ./
RUN npm install
COPY ./src ./src
EXPOSE 3000
CMD [ "node", "src/index.js" ]
RUN ls -R /usr/src/app
RUN pwd