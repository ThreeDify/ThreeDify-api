# ThreeDfiy-api
A RESTful API for ThreeDfiy.

# What's ThreeDfiy?
ThreeDfiy is a online platform where you can upload images and create a 3D reconstruction of the images.

## Environment Variables
| Variable | Description |
|----------|-------------|
| DB_NAME | Name of the database |
| DB_USER | User name of the database |
| DB_PASSWORD | Password for the user of the database |


## Installation
1. Make sure you have `python=3.8.2` and `pip=19.2.3`
2. Install [Postgresql](https://www.postgresql.org/download/)
3. Install `pipenv`
```bash
$ pip3 install pipenv
```
4. Create and activate virtual environment
```bash
$ mkdir .venv
$ pipenv shell --three
```
5. Install requirements
```bash
$ pipenv install
```
6. Create `.env` file (once)
```bash
$ cp .env.example .env
```
7. Run migrations
```bash
$ pipenv run manage migrate
```

## Run
```bash
$ pipenv run start
```

## Lint
Run [black](https://black.readthedocs.io/en/stable/) formatter before pushing.
```bash
$ pipenv run black src/.
```
