'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var _require = require('mongodb'),
    Logger = _require.Logger,
    MongoClient = _require.MongoClient;

var config = require('../config');

module.exports = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
  var db, logCount;
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return MongoClient.connect(config.MONGO_URL);

        case 2:
          db = _context.sent;
          logCount = 0;

          Logger.setCurrentLogger(function (msg, stat) {
            console.log('MONGO DB REQUEST ' + ++logCount + ': ' + msg);
          });
          Logger.setLevel('info');
          Logger.filter('class', ['Cursor']);

          return _context.abrupt('return', {
            Connection: db,
            Topics: db.collection('topics'),
            Oracles: db.collection('oracles'),
            Votes: db.collection('votes'),
            Blocks: db.collection('blocks')
          });

        case 8:
        case 'end':
          return _context.stop();
      }
    }
  }, _callee, undefined);
}));