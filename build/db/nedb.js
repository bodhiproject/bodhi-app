'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var path = require('path');
var datastore = require('nedb-promise');

var topics = datastore({ filename: path.dirname(process.argv[0]) + '/nedb/topics.db', autoload: true });
var oracles = datastore({ filename: path.dirname(process.argv[0]) + '/nedb/oracles.db', autoload: true });
var votes = datastore({ filename: path.dirname(process.argv[0]) + '/nedb/votes.db', autoload: true });
var blocks = datastore({ filename: path.dirname(process.argv[0]) + '/nedb/blocks.db', autoload: true });

var dbPromises = [topics, oracles, votes, blocks];

module.exports = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return Promise.all(dbPromises);

        case 3:
          _context.next = 9;
          break;

        case 5:
          _context.prev = 5;
          _context.t0 = _context['catch'](0);

          console.error('DB load Error: ' + _context.t0.message);
          return _context.abrupt('return');

        case 9:
          return _context.abrupt('return', {
            Topics: topics,
            Oracles: oracles,
            Votes: votes,
            Blocks: blocks
          });

        case 10:
        case 'end':
          return _context.stop();
      }
    }
  }, _callee, undefined, [[0, 5]]);
}));