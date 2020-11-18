FROM node:lts

WORKDIR /action

# Install Dependencies
COPY package.json yarn.lock /action/
RUN yarn install --frozen-lockfile

# Build Image
COPY src/ /action/src/
RUN yarn build

CMD node /action/dist/index.js
