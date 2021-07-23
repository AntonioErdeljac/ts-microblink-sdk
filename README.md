# ts-microblink-sdk

A Microblink SDK integration example

### Code style
[![Typescript](https://img.shields.io/badge/Typescript-white?logo=typescript&style=flat)](https://github.com/prettier/prettier)
[![eslint: airbnb](https://img.shields.io/badge/Eslint-Airbnb-white?logo=airbnb&style=flat)](https://github.com/airbnb/javascript)
[![code style: prettier](https://img.shields.io/badge/Code%20Style-Prettier-white?logo=prettier&style=flat)](https://github.com/prettier/prettier)

### Cloning the repository

```shell
git clone https://github.com/AntonioErdeljac/ts-microblink-sdk.git
```

### Install packages

```shell
npm i
```

### Setup Microblink

```shell
npm run setup
```
### Starting

Make sure you've done `npm run setup` first.

```shell
npm run start
```

### Building

Make sure you've done `npm run setup` first.

```shell
npm run build
```


### Available commands

Running commands with npm `npm run [command]`

| command            | description                                                                                                 |
| :----------------- | :---------------------------------------------------------------------------------------------------------- |
| `start`            | Starts a development instance of the app                                                                    |
| `build`            | Builds production instance of the app                                                                       |
| `setup`            | Prepares necessary files from node_modules                                                                  |

### Environment variables

Copy content from `.env.example` to `.env`

| variable                                     | required                           |
| :------------------------------------------- | :----------------------------------|
| `LICENSE_KEY`                                | true                               |
