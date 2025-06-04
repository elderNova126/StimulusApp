<p align="center">
  <img src="https://ui.getstimulus.io/logo.png" width="320" alt="Stimulus Logo" />
</p>

# Controller

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
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

## Docker build

```bash
docker build -t stimulus/controller .
```

## Documentation
```bash
yarn compodoc -p tsconfig.json -s
```


## Reinstall proto
```bash
rm -r node_modules/controller-proto/ && yarn install --check-files
```