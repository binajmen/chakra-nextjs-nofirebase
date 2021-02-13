# base image
FROM node:14.15.5-buster

# working directory
WORKDIR /app

# add binaries to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /app/
COPY yarn.lock /app/
RUN yarn install

# copy app files and build
COPY . /app
RUN yarn build

# start app
CMD [ "yarn", "start" ]