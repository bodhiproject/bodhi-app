# Bodhi application logic in GraphQL + MongoDB

## Get Started
1. `git clone https://github.com/bodhiproject/bodhi-graphql.git`

2. `cd bodhi-graphql`

3. `npm install`

4. start mongodb at 27017

`docker run -d -p 27017:27017 -v testmongodata:/data/db mongo`

5. start bodhi-graphql at 5555

`node src/index.js`

play with graphiql on `localhost:5555/graphiql`

6. check example react app, detail in `src/example/README.md`

`cd src/example`

`npm install && npm start`

app running at `localhost:3000`


I will setup everything in docker compose after synchronizer logic

## Package & Release
1. `npm install -g pkg`

2. In the dir with package.json, run

`pkg . --out-path bin`

3. all executables are in `bin\`