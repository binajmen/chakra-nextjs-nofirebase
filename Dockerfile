# base image
FROM node:alpine

# working directory
WORKDIR /app

# add binaries to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /app/
COPY yarn.lock /app/
RUN yarn install --frozen-lockfile

# copy app files and build
COPY . /app
RUN yarn build

# start app
CMD [ "yarn", "start" ]