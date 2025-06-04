######################################################################################
FROM node:22-alpine AS builder-proto

RUN apk update && apk upgrade && apk add python3 make g++ && rm -rf /var/cache/apk/*

WORKDIR /proto/controller
COPY ./backend-services/src/proto/controller/ .
RUN yarn install && yarn build
######################################################################################

######################################################################################
FROM node:22-alpine AS tests

RUN apk update && apk upgrade && apk add python3 make g++ && rm -rf /var/cache/apk/*

WORKDIR /app
COPY ./backend-services/src/user-api/ ./user-api
# build application
COPY --from=builder-proto ./proto/controller ./proto/controller
RUN cd user-api && yarn install && yarn build
RUN pwd
RUN ls -al user-api/test
RUN ls -al user-api
RUN cd user-api && yarn test:cov
RUN ls -al user-api
RUN ls -al user-api/test
######################################################################################

######################################################################################
FROM node:22-alpine AS builder

RUN apk update && apk upgrade && apk add python3 make g++ && rm -rf /var/cache/apk/*

WORKDIR /app
COPY /backend-services/src/user-api/ ./user-api
# build application
COPY --from=builder-proto ./proto/controller ./proto/controller
RUN cd user-api && yarn install && yarn build
COPY --from=builder-proto ./proto/controller/node_modules ./node_modules
######################################################################################

######################################################################################
FROM node:22-alpine AS app

WORKDIR /app

# copy from build image
COPY --from=builder /app/user-api/dist ./dist
COPY --from=builder /app/user-api/node_modules ./node_modules
EXPOSE 3000
CMD [ "node", "./dist/main.js" ]
######################################################################################
