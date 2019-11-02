FROM node:lts
WORKDIR /action
COPY package.json yarn.lock /action/
RUN yarn install --frozen-lockfile && yarn build
CMD node /action/dist/index.js
