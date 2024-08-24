## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

Api url returning reachable URL(s), ordered by priority where 1 is highest.
```bash
http://localhost:3000/checkserver
```

Api url returning reachable URL(s) by querying priority number.
```bash
http://localhost:3000/checkserver/{priorityNumber}
```


## Run tests

```bash
# unit tests
$ npm test src/checkserver/unittests
```

## <a href="https://docs.nestjs.com/recipes/documentation" target="_blank">Compodoc documentation</a>

```bash
npx @compodoc/compodoc -p tsconfig.json -s
```