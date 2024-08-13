FROM node:20-alpine

WORKDIR /gremlin-visualizer
ADD package.json .
ADD package-lock.json .
RUN npm cache clean --force && \
	npm config set strict-ssl false && \
	npm install
ADD . .

EXPOSE 3000 3001

ENV HOST='0.0.0.0'
ENV BROWSER='None'
CMD npm start
