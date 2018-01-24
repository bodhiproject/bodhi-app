const restify = require('restify');
const corsMiddleware = require('restify-cors-middleware');
const { spawn } = require('child_process');
const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');

const schema = require('./schema');

const syncRouter = require('./route/sync');
const apiRouter = require('./route/api');

const startSync = require('./sync');

const PORT = 5555;

const server = restify.createServer({
  title: 'Bodhi Synchroniser',
});

const cors = corsMiddleware({
  origins: ['*'],
});
server.pre(cors.preflight);
server.use(cors.actual);
server.use(restify.plugins.bodyParser({ mapParams: true }));
server.use(restify.plugins.queryParser());
server.on('after', (req, res, route, err) => {
  if (route) {
    console.log(`${route.methods[0]} ${route.spec.path} ${res.statusCode}`);
  } else {
    console.log(`${err.message}`);
  }
});

const startAPI = async () => {
  syncRouter.applyRoutes(server);
  apiRouter.applyRoutes(server);

  server.listen(PORT, () => {
    SubscriptionServer.create(
      { execute, subscribe, schema },
      { server, path: '/subscriptions' },
    );
    console.log(`Bodhi API server running on http://localhost:${PORT}.`);
  });
};

const qtumprocess = spawn('./qtum/bin/qtumd', ['-testnet', '-logevents', '-rpcuser=bodhi', '-rpcpassword=bodhi']);

qtumprocess.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

qtumprocess.stderr.on('data', (data) => {
  console.log(`qtum node cant start with error: ${data}`);
  process.exit();
});

qtumprocess.on('close', (code) => {
  console.log(`qtum node exited with code ${code}`);
  process.exit();
});

function exit(signal) {
  console.log(`Received ${signal}, exiting`);
  qtumprocess.kill();
}

process.on(['SIGINT', 'SIGTERM'], exit);

// 3s is sufficient for qtumd to start
setTimeout(() => {
  startSync();
  startAPI();
}, 3000);
