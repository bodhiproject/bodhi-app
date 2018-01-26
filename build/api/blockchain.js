'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _qweb = require('qweb3');

var _qweb2 = _interopRequireDefault(_qweb);

var _config = require('../config/config');

var _config2 = _interopRequireDefault(_config);

var _contract_metadata = require('../config/contract_metadata');

var _contract_metadata2 = _interopRequireDefault(_contract_metadata);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var qClient = new _qweb2.default(_config2.default.QTUM_RPC_ADDRESS);

var Blockchain = {
  getBlockCount: function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt('return', qClient.getBlockCount());

            case 1:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function getBlockCount() {
      return _ref.apply(this, arguments);
    }

    return getBlockCount;
  }(),
  getTransactionReceipt: function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(args) {
      var transactionId;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              transactionId = args.transactionId;

              if (!_lodash2.default.isUndefined(transactionId)) {
                _context2.next = 3;
                break;
              }

              throw new TypeError('transactionId needs to be defined');

            case 3:
              return _context2.abrupt('return', qClient.getTransactionReceipt(transactionId));

            case 4:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function getTransactionReceipt(_x) {
      return _ref2.apply(this, arguments);
    }

    return getTransactionReceipt;
  }(),
  searchLogs: function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(args) {
      var fromBlock, toBlock, addresses, topics;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              fromBlock = args.fromBlock, toBlock = args.toBlock;
              addresses = args.addresses, topics = args.topics;

              if (!_lodash2.default.isUndefined(fromBlock)) {
                _context3.next = 4;
                break;
              }

              throw new TypeError('fromBlock needs to be defined');

            case 4:
              if (!_lodash2.default.isUndefined(toBlock)) {
                _context3.next = 6;
                break;
              }

              throw new TypeError('toBlock needs to be defined');

            case 6:

              if (addresses === undefined) {
                addresses = [];
              }

              if (topics === undefined) {
                topics = [];
              }

              return _context3.abrupt('return', qClient.searchLogs(fromBlock, toBlock, addresses, topics, _contract_metadata2.default, true));

            case 9:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function searchLogs(_x2) {
      return _ref3.apply(this, arguments);
    }

    return searchLogs;
  }()
};

module.exports = Blockchain;