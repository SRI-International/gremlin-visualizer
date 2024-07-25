# FROM node:10-alpine

# RUN npm cache clean --force && \
# 	npm config set strict-ssl false && \
# 	apk add wget unzip && \
# 	wget --no-check-certificate https://github.com/SRI-International/gremlin-visualizer/archive/master.zip && \
# 	unzip master.zip && \
# 	cd gremlin-visualizer-master && \
# 	npm install

# EXPOSE 3000 3001

# WORKDIR /gremlin-visualizer-master

# CMD npm start


FROM node:16-alpine

RUN npm cache clean --force && \
    npm config set strict-ssl false && \
    apk add wget unzip

WORKDIR /app
COPY . /app
RUN npm install

EXPOSE 3000 3001

CMD npm start