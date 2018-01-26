'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var _require = require('apollo-server-restify'),
    graphqlRestify = _require.graphqlRestify,
    graphiqlRestify = _require.graphiqlRestify;

var Router = require('restify-router').Router;

var connectDB = require('../db/nedb');
var schema = require('../schema');

var syncPort = 5555;

var syncRouter = new Router();

var graphQLOptions = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return connectDB();

          case 2:
            _context.t0 = _context.sent;
            _context.t1 = {
              db: _context.t0
            };
            _context.t2 = schema;
            return _context.abrupt('return', {
              context: _context.t1,
              schema: _context.t2
            });

          case 6:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function graphQLOptions() {
    return _ref.apply(this, arguments);
  };
}();

syncRouter.get('/graphql', graphqlRestify(graphQLOptions));
syncRouter.post('/graphql', graphqlRestify(graphQLOptions));

syncRouter.get('/graphiql', graphiqlRestify({
  endpointURL: '/graphql',
  subscriptionsEndpoint: 'ws://localhost:' + syncPort + '/subscriptions'
}));

module.exports = syncRouter;