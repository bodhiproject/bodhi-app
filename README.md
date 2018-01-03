# Bodhi-App

## Get Started

### 1. Install Docker
[Install Docker for Mac](https://docs.docker.com/docker-for-mac/install/#install-and-run-docker-for-mac)
[Install Docker for Windows](https://docs.docker.com/docker-for-windows/install/)
[Install Docker for Others](https://docs.docker.com/engine/installation/#desktop)

### 2. Clone this repsoitory
`git clone https://github.com/bodhiproject/bodhi-app.git`

### 3. Run command
Open Terminal, navigate to under the newly cloned folder and run 
1. `git submodule update --init --remote` to pull source code of Bodhi components
2. `docker-compose up` to execute setup commands we prepared in ./docker-compose.yml and start components in order. Or, `docker-compose up -d` to run in background

In order to stop bodhi app and related services, run `docker-compose down`.
