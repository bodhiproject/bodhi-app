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

`docker-compose build`

This will build the bodhi application, you only need build once

To start the application

`docker-compose start`

To access the bodhi application

Go to `localhost:5557` in your browser

To stop the application

`docker-compose stop`
