const express = require('express');
const cors = require('cors')
const {spawn} = require('child_process');

// This package automatically parses JSON requests.
const bodyParser = require('body-parser');

// This package will handle GraphQL server requests and responses
// for you, based on your schema.
const {graphqlExpress, graphiqlExpress} = require('apollo-server-express');

const schema = require('./schema');

const connectDB = require('./db/nedb');
const startSync = require('./sync')

const {execute, subscribe} = require('graphql');
const {createServer} = require('http');
const {SubscriptionServer} = require('subscriptions-transport-ws');

const startAPI = async () => {

  const db = await connectDB()
  var app = express();

  const PORT = 5555;
  app.use(cors());

  app.use('/graphql', bodyParser.json(), graphqlExpress({
    context: {
      db
    },
    schema
  }));

  app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
    subscriptionsEndpoint: `ws://localhost:${PORT}/subscriptions`,
  }));

  const server = createServer(app);
  server.listen(PORT, () => {
    SubscriptionServer.create(
      {execute, subscribe, schema},
      {server, path: '/subscriptions'},
    );
    console.log(`Bodhi API GraphQL server running on http://localhost:${PORT}.`)
  });
};

const qtumprocess = spawn(`./qtum/bin/qtumd`, ['-testnet', '-logevents', '-rpcuser=bodhi', '-rpcpassword=bodhi']);

qtumprocess.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

qtumprocess.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`);
});

qtumprocess.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});

// 5s is sufficient for qtumd to start
setTimeout(function(){
  startSync();
  startAPI();
}, 5000);

