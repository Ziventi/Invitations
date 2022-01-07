FROM node:16.13.1-alpine

## Copy root tsconfig.json
WORKDIR /home/circleci/ziventi
COPY ./code/tsconfig.json .

## Copy and install utils
WORKDIR /home/circleci/ziventi/utils
COPY ./code/utils/package*.json .
RUN npm ci --production
COPY ./code/utils .
RUN npm run build:prod

## Copy and install server
WORKDIR /home/circleci/ziventi/server
COPY ./code/server/package*.json .
RUN npm ci --production
COPY ./code/server .
RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "prod" ]