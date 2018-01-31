'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

require('babel-core/register');
require('babel-polyfill');

var path = require('path');
var restify = require('restify');
var corsMiddleware = require('restify-cors-middleware');

var _require = require('child_process'),
    spawn = _require.spawn;

var _require2 = require('graphql'),
    execute = _require2.execute,
    subscribe = _require2.subscribe;

var _require3 = require('subscriptions-transport-ws'),
    SubscriptionServer = _require3.SubscriptionServer;

var opn = require('opn');

var schema = require('./schema');

var syncRouter = require('./route/sync');
var apiRouter = require('./route/api');

var startSync = require('./sync');

var PORT = 5555;

var server = restify.createServer({
  title: 'Bodhi Synchroniser'
});

var cors = corsMiddleware({
  origins: ['*']
});

server.pre(cors.preflight);
server.use(cors.actual);
server.use(restify.plugins.bodyParser({ mapParams: true }));
server.use(restify.plugins.queryParser());
server.on('after', function (req, res, route, err) {
  if (route) {
    console.log(route.methods[0] + ' ' + route.spec.path + ' ' + res.statusCode);
  } else {
    console.log('' + err.message);
  }
});

var startAPI = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            syncRouter.applyRoutes(server);
            apiRouter.applyRoutes(server);

            server.get(/\/?.*/, restify.plugins.serveStatic({
              directory: path.join(__dirname, '../ui'),
              default: 'index.html'
            }));

            server.listen(PORT, function () {
              SubscriptionServer.create({ execute: execute, subscribe: subscribe, schema: schema }, { server: server, path: '/subscriptions' });
              console.log('Bodhi App is running on http://localhost:' + PORT + '.');
            });

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function startAPI() {
    return _ref.apply(this, arguments);
  };
}();

var openBrowser = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var platform;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            platform = process.platform;

            if (!platform.includes('darwin')) {
              _context2.next = 7;
              break;
            }

            _context2.next = 5;
            return opn('http://localhost:' + PORT, {
              app: ['google chrome', '--incognito']
            });

          case 5:
            _context2.next = 15;
            break;

          case 7:
            if (!platform.includes('win')) {
              _context2.next = 12;
              break;
            }

            _context2.next = 10;
            return opn('http://localhost:' + PORT, {
              app: ['chrome', '--incognito']
            });

          case 10:
            _context2.next = 15;
            break;

          case 12:
            if (!platform.includes('linux')) {
              _context2.next = 15;
              break;
            }

            _context2.next = 15;
            return opn('http://localhost:' + PORT, {
              app: ['google-chrome', '--incognito']
            });

          case 15:
            _context2.next = 22;
            break;

          case 17:
            _context2.prev = 17;
            _context2.t0 = _context2['catch'](0);

            console.debug('Chrome not found. Launching default browser.');
            _context2.next = 22;
            return opn('http://localhost:' + PORT);

          case 22:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined, [[0, 17]]);
  }));

  return function openBrowser() {
    return _ref2.apply(this, arguments);
  };
}();

// avoid using path.join for pkg to pack qtumd
var qtumdPath = path.dirname(process.argv[0]) + '/qtumd';
var qtumprocess = spawn(qtumdPath, ['-testnet', '-logevents', '-rpcuser=bodhi', '-rpcpassword=bodhi'], {});

qtumprocess.stdout.on('data', function (data) {
  console.log('stdout: ' + data);
});

qtumprocess.stderr.on('data', function (data) {
  console.log('qtum node cant start with error: ' + data);
  process.exit();
});

qtumprocess.on('close', function (code) {
  console.log('qtum node exited with code ' + code);
  process.exit();
});

function exit(signal) {
  console.log('Received ' + signal + ', exiting');
  qtumprocess.kill();
  process.exit();
}

process.on('SIGINT', exit);
process.on('SIGTERM', exit);
process.on('SIGHUP', exit);

// 3s is sufficient for qtumd to start
setTimeout(function () {
  startSync();
  startAPI();
  openBrowser();
}, 3000);