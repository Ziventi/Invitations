FROM node:16.13.1-alpine

ARG PORT
ARG WORKDIR

## Copy root tsconfig.json
WORKDIR /var/www/$WORKDIR
COPY ./code/tsconfig.json .

## Copy and install utils
WORKDIR /var/www/$WORKDIR/utils
COPY ./code/utils/package*.json ./
RUN npm ci --production
COPY ./code/utils ./
RUN npm run build:prod

## Copy and install server
WORKDIR /var/www/$WORKDIR/server
COPY ./code/server/package*.json ./
RUN npm ci --production
COPY ./code/server ./
RUN npm run build

EXPOSE $PORT

CMD [ "npm", "run", "prod" ]