# FROM node:10-alpine

# RUN npm cache clean --force && \
# 	npm config set strict-ssl false && \
# 	apk add wget unzip && \
# 	wget --no-check-certificate https://github.com/prabushitha/gremlin-visualizer/archive/master.zip && \
# 	unzip master.zip && \
# 	cd gremlin-visualizer-master && \
# 	npm install

# EXPOSE 3000 3001

# WORKDIR /gremlin-visualizer-master

# CMD npm start

FROM node:16.15.1

WORKDIR /usr/src/app/gremlin-visualizer
# RUN npm install -g typescript 

# Add the minimum set of files to do the yarn install.
# This speeds up rebuilds by reducing Docker cache misses.
ADD package-lock.json package.json ./
RUN npm install

# Add the remainder of the files and build
ADD . .

WORKDIR /usr/src/app/gremlin-visualizer
EXPOSE 3000 3001
CMD npm start
