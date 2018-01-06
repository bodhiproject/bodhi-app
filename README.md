# Bodhi-App

## Get Started

### 1. Install Docker
[Install Docker for Mac](https://docs.docker.com/docker-for-mac/install/#install-and-run-docker-for-mac)
[Install Docker for Windows](https://docs.docker.com/docker-for-windows/install/)
[Install Docker for Others](https://docs.docker.com/engine/installation/#desktop)

### 2. Clone this repsoitory

`git clone --recursive https://github.com/bodhiproject/bodhi-app.git`

### 3. Run command

Open Terminal, navigate to under the newly cloned folder and run

`docker-compose up -d`

This will build and start the bodhi application

To access the bodhi application

Go to `localhost:5557` in your browser

To stop the application

`docker-compose stop`

### 4. Upgrade application

Bodhi Alpha app will release upgrades regularly. Whenver there is an upgrade, run

`git pull origin master`

Then run docker command with `--build` once

`docker-compose up --build -d`

Later on, you can start app by `docker-compose up -d` without `--build`
