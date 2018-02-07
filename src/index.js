const _ = require('lodash');
const path = require('path');
const restify = require('restify');
const corsMiddleware = require('restify-cors-middleware');
const { spawn } = require('child_process');
const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const opn = require('opn');

const logger = require('./utils/logger');
const schema = require('./schema');
const syncRouter = require('./route/sync');
const apiRouter = require('./route/api');
const startSync = require('./sync');

const PORT = 5555;

// Restify setup
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
    logger.debug(`${route.methods[0]} ${route.spec.path} ${res.statusCode}`);
  } else {
    logger.error(`${err.message}`);
  }
});

let qtumProcess;

function startQtumProcess(reindex) {
  let basePath;
  if (process.argv[2]) {
    basePath = (_.split(process.argv[2], '=', 2))[1];
  } else {
    basePath = `${path.dirname(process.argv[0])}/qtum`;
  }

  // avoid using path.join for pkg to pack qtumd
  const qtumdPath = `${basePath}/qtumd`;
  logger.debug(`qtumd dir: ${qtumdPath}`);

  const flags = ['-testnet', '-logevents', '-rpcuser=bodhi', '-rpcpassword=bodhi'];
  if (reindex) {
    flags.push('-reindex');
  }

  qtumProcess = spawn(qtumdPath, flags);
  logger.debug(`qtumd started on PID ${qtumProcess.pid}`);

  qtumProcess.stdout.on('data', (data) => {
    logger.debug(`qtumd output: ${data}`);
  });

  qtumProcess.stderr.on('data', (data) => {
    logger.error(`qtumd failed with error: ${data}`);

    if (data.includes('You need to rebuild the database using -reindex-chainstate to enable -logevents.')) {
      // Clean old process first
      qtumProcess.kill();
      qtumProcess = null;

      // Restart qtumd with reindex flag
      setTimeout(() => {
        console.log('Restarting and reindexing Qtum blockchain');
        startQtumProcess(true);
      }, 3000);
    } else {
      // add delay to give some time to write to log file
      setTimeout(() => {
        process.exit();
      }, 500);
    }
  });

  qtumProcess.on('close', (code) => {
    logger.debug(`qtumd exited with code ${code}`);
  });
}

async function startAPI() {
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
}

async function openBrowser() {
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
  } catch (err) {
    logger.debug('Chrome not found. Launching default browser.');
    await opn(`http://localhost:${PORT}`);
  }
}

function exit(signal) {
  logger.info(`Received ${signal}, exiting`);

  // add delay to give some time to write to log file
  setTimeout(() => {
    qtumProcess.kill();
    process.exit();
  }, 500);
}

process.on('SIGINT', exit);
process.on('SIGTERM', exit);
process.on('SIGHUP', exit);

startQtumProcess(false);

// Wait 4s for qtumd to start and reindex if necessary
setTimeout(() => {
  startSync();
  startAPI();
  openBrowser();
}, 5000);
