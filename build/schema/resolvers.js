'use strict';

function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError("Cannot destructure undefined"); }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/* eslint no-underscore-dangle: [2, { "allow": ["_id"] }] */

var _ = require('lodash');
var pubsub = require('../pubsub');
var fetch = require('node-fetch');

var DEFAULT_LIMIT_NUM = 50;
var DEFAULT_SKIP_NUM = 0;

function buildCursorOptions(cursor, orderBy, limit, skip) {
  if (!_.isEmpty(orderBy)) {
    var sortDict = {};
    _.forEach(orderBy, function (order) {
      sortDict[order.field] = order.direction === 'ASC' ? 1 : -1;
    });

    cursor.sort(sortDict);
  }

  cursor.limit(limit || DEFAULT_LIMIT_NUM);
  cursor.skip(skip || DEFAULT_SKIP_NUM);

  return cursor;
}

function buildTopicFilters(_ref) {
  var _ref$OR = _ref.OR,
      OR = _ref$OR === undefined ? [] : _ref$OR,
      address = _ref.address,
      status = _ref.status;

  var filter = address || status ? {} : null;
  if (address) {
    filter._id = address;
  }

  if (status) {
    filter.status = status;
  }

  var filters = filter ? [filter] : [];
  for (var i = 0; i < OR.length; i++) {
    filters = filters.concat(buildTopicFilters(OR[i]));
  }
  return filters;
}

function buildOracleFilters(_ref2) {
  var _ref2$OR = _ref2.OR,
      OR = _ref2$OR === undefined ? [] : _ref2$OR,
      address = _ref2.address,
      topicAddress = _ref2.topicAddress,
      resultSetterQAddress = _ref2.resultSetterQAddress,
      status = _ref2.status,
      token = _ref2.token;

  var filter = address || topicAddress || resultSetterQAddress || status || token ? {} : null;
  if (address) {
    filter._id = address;
  }

  if (topicAddress) {
    filter.topicAddress = topicAddress;
  }

  if (resultSetterQAddress) {
    filter.resultSetterQAddress = resultSetterQAddress;
  }

  if (status) {
    filter.status = status;
  }

  if (token) {
    filter.token = token;
  }

  var filters = filter ? [filter] : [];
  for (var i = 0; i < OR.length; i++) {
    filters = filters.concat(buildOracleFilters(OR[i]));
  }

  return filters;
}

function buildSearchOracleFilter(searchPhrase) {
  var filterFields = ['name', '_id', 'topicAddress', 'resultSetterAddress', 'resultSetterQAddress'];
  if (!searchPhrase) {
    return [];
  }

  var filters = [];
  for (var i = 0; i < filterFields.length; i++) {
    var filter = {};
    filter[filterFields[i]] = { $regex: '.*' + searchPhrase + '.*' };
    filters.push(filter);
  }

  return filters;
}

function buildVoteFilters(_ref3) {
  var _ref3$OR = _ref3.OR,
      OR = _ref3$OR === undefined ? [] : _ref3$OR,
      oracleAddress = _ref3.oracleAddress,
      voterAddress = _ref3.voterAddress,
      voterQAddress = _ref3.voterQAddress,
      optionIdx = _ref3.optionIdx;

  var filter = oracleAddress || voterAddress || voterQAddress || optionIdx ? {} : null;

  if (oracleAddress) {
    filter.oracleAddress = oracleAddress;
  }

  if (voterAddress) {
    filter.voterAddress = voterAddress;
  }

  if (voterQAddress) {
    filter.voterQAddress = voterQAddress;
  }

  if (optionIdx) {
    filter.optionIdx = optionIdx;
  }

  var filters = filter ? [filter] : [];
  for (var i = 0; i < OR.length; i++) {
    filters = filters.concat(buildVoteFilters(OR[i]));
  }
  return filters;
}

module.exports = {
  Query: {
    allTopics: function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(root, _ref4, _ref5) {
        var filter = _ref4.filter,
            orderBy = _ref4.orderBy,
            limit = _ref4.limit,
            skip = _ref4.skip;
        var Topics = _ref5.db.Topics;
        var query, cursor;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                query = filter ? { $or: buildTopicFilters(filter) } : {};
                cursor = Topics.cfind(query);

                cursor = buildCursorOptions(cursor, orderBy, limit, skip);

                return _context.abrupt('return', cursor.exec());

              case 4:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, undefined);
      }));

      function allTopics(_x, _x2, _x3) {
        return _ref6.apply(this, arguments);
      }

      return allTopics;
    }(),

    allOracles: function () {
      var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(root, _ref7, _ref8) {
        var filter = _ref7.filter,
            orderBy = _ref7.orderBy,
            limit = _ref7.limit,
            skip = _ref7.skip;
        var Oracles = _ref8.db.Oracles;
        var query, cursor;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                query = filter ? { $or: buildOracleFilters(filter) } : {};
                cursor = Oracles.cfind(query);

                cursor = buildCursorOptions(cursor, orderBy, limit, skip);
                return _context2.abrupt('return', cursor.exec());

              case 4:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, undefined);
      }));

      function allOracles(_x4, _x5, _x6) {
        return _ref9.apply(this, arguments);
      }

      return allOracles;
    }(),

    searchOracles: function () {
      var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(root, _ref10, _ref11) {
        var searchPhrase = _ref10.searchPhrase,
            orderBy = _ref10.orderBy,
            limit = _ref10.limit,
            skip = _ref10.skip;
        var Oracles = _ref11.db.Oracles;
        var query, cursor;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                query = searchPhrase ? { $or: buildSearchOracleFilter(searchPhrase) } : {};
                cursor = Oracles.cfind(query);

                cursor = buildCursorOptions(cursor, orderBy, limit, skip);
                return _context3.abrupt('return', cursor.exec());

              case 4:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, undefined);
      }));

      function searchOracles(_x7, _x8, _x9) {
        return _ref12.apply(this, arguments);
      }

      return searchOracles;
    }(),

    allVotes: function () {
      var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(root, _ref13, _ref14) {
        var filter = _ref13.filter,
            orderBy = _ref13.orderBy,
            limit = _ref13.limit,
            skip = _ref13.skip;
        var Votes = _ref14.db.Votes;
        var query, cursor;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                query = filter ? { $or: buildVoteFilters(filter) } : {};
                cursor = Votes.cfind(query);

                cursor = buildCursorOptions(cursor, orderBy, limit, skip);
                return _context4.abrupt('return', cursor.exec());

              case 4:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, undefined);
      }));

      function allVotes(_x10, _x11, _x12) {
        return _ref15.apply(this, arguments);
      }

      return allVotes;
    }(),

    syncInfo: function () {
      var _ref18 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(root, _ref16, _ref17) {
        var Blocks = _ref17.db.Blocks;
        var syncBlockNum, blocks, chainBlockNum, resp, json;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _objectDestructuringEmpty(_ref16);

                syncBlockNum = null;
                blocks = void 0;
                _context5.prev = 3;
                _context5.next = 6;
                return Blocks.cfind({}).sort({ blockNum: -1 }).limit(1).exec();

              case 6:
                blocks = _context5.sent;
                _context5.next = 12;
                break;

              case 9:
                _context5.prev = 9;
                _context5.t0 = _context5['catch'](3);

                console.error('Error query latest block from db: ' + _context5.t0.message);

              case 12:

                if (blocks.length > 0) {
                  syncBlockNum = blocks[0].blockNum;
                }

                chainBlockNum = null;
                _context5.prev = 14;
                _context5.next = 17;
                return fetch('https://testnet.qtum.org/insight-api/status?q=getInfo');

              case 17:
                resp = _context5.sent;
                _context5.next = 20;
                return resp.json();

              case 20:
                json = _context5.sent;

                chainBlockNum = json.info.blocks;
                _context5.next = 27;
                break;

              case 24:
                _context5.prev = 24;
                _context5.t1 = _context5['catch'](14);

                console.error('Error GET https://testnet.qtum.org/insight-api/status?q=getInfo: ' + _context5.t1.message);

              case 27:
                return _context5.abrupt('return', { syncBlockNum: syncBlockNum, chainBlockNum: chainBlockNum });

              case 28:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, undefined, [[3, 9], [14, 24]]);
      }));

      function syncInfo(_x13, _x14, _x15) {
        return _ref18.apply(this, arguments);
      }

      return syncInfo;
    }()
  },

  Mutation: {
    createTopic: function () {
      var _ref20 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(root, data, _ref19) {
        var Topics = _ref19.db.Topics;
        var response, newTopic;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                data.status = 'CREATED';
                data.qtumAmount = Array(data.options.length).fill(0);
                data.botAmount = Array(data.options.length).fill(0);

                _context6.next = 5;
                return Topics.insert(data);

              case 5:
                response = _context6.sent;
                newTopic = Object.assign({ id: response.insertedIds[0] }, data);


                pubsub.publish('Topic', { Topic: { mutation: 'CREATED', node: newTopic } });
                return _context6.abrupt('return', newTopic);

              case 9:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, undefined);
      }));

      function createTopic(_x16, _x17, _x18) {
        return _ref20.apply(this, arguments);
      }

      return createTopic;
    }(),

    createOracle: function () {
      var _ref22 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(root, data, _ref21) {
        var Oracles = _ref21.db.Oracles;
        var response, newOracle;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                data.status = 'CREATED';
                data.amounts = Array(data.options.length).fill(0);

                _context7.next = 4;
                return Oracles.insert(data);

              case 4:
                response = _context7.sent;
                newOracle = Object.assign({ id: response.insertedIds[0] }, data);
                return _context7.abrupt('return', newOracle);

              case 7:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, undefined);
      }));

      function createOracle(_x19, _x20, _x21) {
        return _ref22.apply(this, arguments);
      }

      return createOracle;
    }(),

    createVote: function () {
      var _ref24 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(root, data, _ref23) {
        var Votes = _ref23.db.Votes;
        var response;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.next = 2;
                return Votes.insert(data);

              case 2:
                response = _context8.sent;
                return _context8.abrupt('return', Object.assign({ id: response.insertedIds[0] }, data));

              case 4:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, undefined);
      }));

      function createVote(_x22, _x23, _x24) {
        return _ref24.apply(this, arguments);
      }

      return createVote;
    }()
  },

  Topic: {
    oracles: function () {
      var _ref27 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(_ref25, data, _ref26) {
        var address = _ref25.address;
        var Oracles = _ref26.db.Oracles;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                return _context9.abrupt('return', Oracles.find({ topicAddress: address }));

              case 1:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, undefined);
      }));

      function oracles(_x25, _x26, _x27) {
        return _ref27.apply(this, arguments);
      }

      return oracles;
    }()
  },

  Subscription: {
    Topic: {
      subscribe: function subscribe() {
        return pubsub.asyncIterator('Topic');
      }
    }
  }
};