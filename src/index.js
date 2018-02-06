const logger = require('./utils/logger');
const fs = require('fs');

const path = require('path');
const restify = require('restify');
const corsMiddleware = require('restify-cors-middleware');
const { spawn } = require('child_process');
const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const opn = require('opn');

const schema = require('./schema');
const config = require('./config/config');

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

const dir = config.LOG_PATH;

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

server.pre(cors.preflight);
server.use(cors.actual);
server.use(restify.plugins.bodyParser({ mapParams: true }));
server.use(restify.plugins.queryParser());
server.on('after', (req, res, route, err) => {
  if (route) {
    logger.debug(`${route.methods[0]} ${route.spec.path} ${res.statusCode}`);
  } else {
    logger.error(`${err.message}`);
  }
});

const startAPI = async () => {
  syncRouter.applyRoutes(server);
  apiRouter.applyRoutes(server);

  server.get(/\/?.*/, restify.plugins.serveStatic({
    directory: path.join(__dirname, '../ui'),
    default: 'index.html',
  }));

  server.listen(PORT, () => {
    SubscriptionServer.create(
      { execute, subscribe, schema },
      { server, path: '/subscriptions' },
    );
    logger.info(`Bodhi App is running on http://localhost:${PORT}.`);
  });
};

const openBrowser = async () => {
  try {
    const platform = process.platform;
    if (platform.includes('darwin')) {
      await opn(`http://localhost:${PORT}`, {
        app: ['google chrome', '--incognito'],
      });
    } else if (platform.includes('win')) {
      await opn(`http://localhost:${PORT}`, {
        app: ['chrome', '--incognito'],
      });
    } else if (platform.includes('linux')) {
      await opn(`http://localhost:${PORT}`, {
        app: ['google-chrome', '--incognito'],
      });
    }
  } catch(err) {
    logger.debug('Chrome not found. Launching default browser.');
    await opn(`http://localhost:${PORT}`);
  }
};

// avoid using path.join for pkg to pack qtumd
const qtumdPath = `${path.dirname(__dirname)}/qtumd`;
const qtumprocess = spawn(qtumdPath, ['-testnet', '-logevents', '-rpcuser=bodhi', '-rpcpassword=bodhi'], {});

qtumprocess.stdout.on('data', (data) => {
  logger.debug(`stdout: ${data}`);
});

// add delay to give some time to write to log file
qtumprocess.stderr.on('data', (data) => {
  logger.error(`qtum node cant start with error: ${data}`);
  setTimeout(() => {
    process.exit()
  }, 500);
});

// add delay to give some time to write to log file
qtumprocess.on('close', (code) => {
  logger.debug(`qtum node exited with code ${code}`);
  setTimeout(() => {
    process.exit()
  }, 500);
});

function exit(signal) {
  logger.debug(`Received ${signal}, exiting`);
  qtumprocess.kill();
  process.exit();
}

process.on('SIGINT', exit);
process.on('SIGTERM', exit);
process.on('SIGHUP', exit);

// 3s is sufficient for qtumd to start
setTimeout(() => {
  startSync();
  startAPI();
  openBrowser();
}, 3000);


