# ThreeDfiy-api
A RESTful API for ThreeDfiy.

# What's ThreeDfiy?
ThreeDfiy is a online platform where you can upload images and create a 3D reconstruction of the images.

## Installation
1. Make sure you have `python=3.8.2` and `pip=19.2.3`
2. Install `pipenv`
```bash
$ pip3 install pipenv
```
3. Create and activate virtual environment
```bash
$ mkdir .venv
$ pipenv shell --three
```
4. Install requirements
```bash
$ pipenv install
```

## Run
1. Create `.env` file (once)
```bash
$ cp .env.example .env
```
2. Then
```bash
$ pipenv run python src/main.py
```
