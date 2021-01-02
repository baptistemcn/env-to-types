# env-to-types

## WHAT THE PURPOSE ?

Transform your `.env` file as input 👌🏻

```
USER_DATABASE="user"
PASSWORD_DATABASE="password"
```

And generates a `.d.ts` file automatically

```
declare namespace NodeJS {
  export interface ProcessEnv {
    USER_DATABASE: string
    PASSWORD_DATABASE: string
  }
}
```

Now `process.env.USER_DATABASE` will autocomplete and SAFE.

## USAGE

```
npx env-to-types path/to/.env
```

## OPTIONS

```
-v, --version               Show the CLI Version
-h, --help                  Show CLI usage information
-o, --output-type           Output name/path for types files | default will be `env.d.ts`
-e, --env-path-example      Path to save generate .env.example file
```

## EXAMPLE W/ OPTIONS

```
npx env-to-types .env -o src/types/env.d.ts -e .
```
