# threedify-api

A RESTful API for ThreeDify.

[![Build](https://github.com/silwalanish/ThreeDify-api/workflows/Build/badge.svg)](https://github.com/silwalanish/ThreeDify-api/actions)
[![Lint](https://github.com/silwalanish/ThreeDify-api/workflows/Lint%20Check/badge.svg)](https://github.com/silwalanish/ThreeDify-api/actions)

# What's ThreeDify?

ThreeDify is a online platform where you can upload images and create a 3D reconstruction of the images.

## Environment Variables

| Variable                      | Description                                      |
| ----------------------------- | ------------------------------------------------ |
| BASE_URL                      | API base url e.g. http://localhost               |
| APP_BASE_URL                  | APP url e.g. http://localhost:8000               |
| PORT                          | Port to serve the api e.g. 3000                  |
| ACCESS_TOKEN_SECRET           | Key used for signing access token                |
| REFRESH_TOKEN_SECRET          | Key used for signing refresh token               |
| DB_NAME                       | Name of the database                             |
| DB_USER                       | User name of the database                        |
| DB_PASSWORD                   | Password for the user of the database            |
| STORAGE_API                   | Storage api to use. Can be `local` or `drive`.   |
| GOOGLE_CLIENT_ID              | Client Id for google oauth app.                  |
| GOOGLE_CLIENT_SECRET          | Client Secret for google oauth app.              |
| GOOGLE_REDIRECT_URL           | Redirect url for google oauth app.               |
| GOOGLE_REFRESH_TOKEN          | Refresh token for google oauth app               |
| GOOGLE_DRIVE_UPLOAD_FOLDER_ID | Id of folder to upload files to in google drive. |

## Installation

1. Make sure you have `node-v13.11.0` and `yarn-v1.22.4`
2. Install [Postgresql](https://www.postgresql.org/download/)
3. Install dependencies

```
$ yarn
```

3. Create `.env` file

```
$ cp .env.example .env
```

## Migrations

We use [knex](http://knexjs.org/) for managing migration. You can find all the migration in `migrations` folder.

##### Migrate

```bash
$ yarn knex migrate:latest
```

##### Make

```bash
$ yarn knex migrate:make migration_name
```

##### Rollback

```bash
$ yarn knex migrate:down
```

Read more about [knex](http://knexjs.org/).

## Build

```bash
$ yarn build
```

## Run

```bash
$ yarn start
```

## Development Server

```bash
$ yarn start:dev
```

## Lint

Check lint errors

```bash
$ yarn lint
```

Fix lint errors

```bash
$ yarn lint:fix
```
