<p align="center">
  <img src="https://ui.getstimulus.io/logo.png" width="320" alt="Stimulus Logo" />
</p>

# User API

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Documentation

```bash
yarn compodoc -p tsconfig.json -s
```

## Reinstall proto

```bash
rm -r node_modules/controller-proto/ && yarn install --check-files
```

## Development env

## Azurite

You will need the Shared Key generated by the azurite service if you want to do a postman or curl call.
Get the Shared Key generated from the debug.log file
The log message when the key is calculated

```bash
2020-07-27T08:36:42.764Z b927b031-f001-4a2b-aa40-9763de59f3a8 info: BlobSharedKeyAuthenticator:validate() Calculated authentication header based on key1: SharedKey devstoreaccount1:zim2O0863nRclLHCSZ0hIW63QUX2Y+9HAd1A+n0kntA= zim2O0863nRclLHCSZ0hIW63QUX2Y+9HAd1A+n0kntA=
```

## Steps

* Docker run command

```bash
docker run -p 10000:10000 -p 10001:10001 -d -v localPath/workspace:/workspace --name azurite mcr.microsoft.com/azure-storage/azurite:3.8.0 azurite -l /workspace -d /workspace/debug.log --blobPort 10000 --blobHost 0.0.0.0 --queuePort 10001 --queueHost 0.0.0.0
```

* Create the container (Example curl for creating a container)

```bash
curl -H "x-ms-version: 2017-07-29 \
x-ms-date: Mon, 27 Jul 2020 07:39:00 GMT \
Authorization: SharedKey devstoreaccount1:zim2O0863nRclLHCSZ0hIW63QUX2Y+9HAd1A+n0kntA= " \
-X PUT http://127.0.0.1:10000/devstoreaccount1/[tenantId]/\?restype\=container
```
