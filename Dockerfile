FROM node:22-alpine
WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npm run build
CMD [ "node", "start" ]