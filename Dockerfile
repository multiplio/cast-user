FROM node:8

# Install yarn
RUN curl -o- -L https://yarnpkg.com/install.sh | bash

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json yarn.lock ./

RUN yarn install --production --frozen-lockfile

# Bundle app source
COPY . .

# Start
EXPOSE 3000
USER node
ENTRYPOINT [ "npm", "start" ]
