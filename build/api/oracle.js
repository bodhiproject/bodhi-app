'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _qweb = require('qweb3');

var _config = require('../config/config');

var _config2 = _interopRequireDefault(_config);

var _contract_metadata = require('../config/contract_metadata');

var _contract_metadata2 = _interopRequireDefault(_contract_metadata);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var ORACLE_CENTRALIZED = 'centralized';
var ORACLE_DECENTRALIZED = 'decentralized';

function getContract(oracleType, contractAddress) {
  switch (oracleType) {
    case ORACLE_CENTRALIZED:
      {
        return new _qweb.Contract(_config2.default.QTUM_RPC_ADDRESS, contractAddress, _contract_metadata2.default.CentralizedOracle.abi);
      }
    case ORACLE_DECENTRALIZED:
      {
        return new _qweb.Contract(_config2.default.QTUM_RPC_ADDRESS, contractAddress, _contract_metadata2.default.DecentralizedOracle.abi);
      }
    default:
      {
        throw new TypeError('Invalid oracle type');
      }
  }
}

var Oracle = {
  eventAddress: function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(args) {
      var contractAddress, oracleType, senderAddress, oracle;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              contractAddress = args.contractAddress, oracleType = args.oracleType, senderAddress = args.senderAddress;

              if (!_lodash2.default.isUndefined(contractAddress)) {
                _context.next = 3;
                break;
              }

              throw new TypeError('contractAddress needs to be defined');

            case 3:
              if (!_lodash2.default.isUndefined(oracleType)) {
                _context.next = 5;
                break;
              }

              throw new TypeError('oracleType needs to be defined');

            case 5:
              if (!_lodash2.default.isUndefined(senderAddress)) {
                _context.next = 7;
                break;
              }

              throw new TypeError('senderAddress needs to be defined');

            case 7:
              oracle = getContract(oracleType, contractAddress);
              return _context.abrupt('return', oracle.call('eventAddress', {
                methodArgs: [],
                senderAddress: senderAddress
              }));

            case 9:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function eventAddress(_x) {
      return _ref.apply(this, arguments);
    }

    return eventAddress;
  }(),
  consensusThreshold: function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(args) {
      var contractAddress, oracleType, senderAddress, oracle;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              contractAddress = args.contractAddress, oracleType = args.oracleType, senderAddress = args.senderAddress;

              if (!_lodash2.default.isUndefined(contractAddress)) {
                _context2.next = 3;
                break;
              }

              throw new TypeError('contractAddress needs to be defined');

            case 3:
              if (!_lodash2.default.isUndefined(oracleType)) {
                _context2.next = 5;
                break;
              }

              throw new TypeError('oracleType needs to be defined');

            case 5:
              if (!_lodash2.default.isUndefined(senderAddress)) {
                _context2.next = 7;
                break;
              }

              throw new TypeError('senderAddress needs to be defined');

            case 7:
              oracle = getContract(oracleType, contractAddress);
              return _context2.abrupt('return', oracle.call('consensusThreshold', {
                methodArgs: [],
                senderAddress: senderAddress
              }));

            case 9:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function consensusThreshold(_x2) {
      return _ref2.apply(this, arguments);
    }

    return consensusThreshold;
  }(),
  finished: function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(args) {
      var contractAddress, oracleType, senderAddress, oracle;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              contractAddress = args.contractAddress, oracleType = args.oracleType, senderAddress = args.senderAddress;

              if (!_lodash2.default.isUndefined(contractAddress)) {
                _context3.next = 3;
                break;
              }

              throw new TypeError('contractAddress needs to be defined');

            case 3:
              if (!_lodash2.default.isUndefined(oracleType)) {
                _context3.next = 5;
                break;
              }

              throw new TypeError('oracleType needs to be defined');

            case 5:
              if (!_lodash2.default.isUndefined(senderAddress)) {
                _context3.next = 7;
                break;
              }

              throw new TypeError('senderAddress needs to be defined');

            case 7:
              oracle = getContract(oracleType, contractAddress);
              return _context3.abrupt('return', oracle.call('finished', {
                methodArgs: [],
                senderAddress: senderAddress
              }));

            case 9:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function finished(_x3) {
      return _ref3.apply(this, arguments);
    }

    return finished;
  }()
};

module.exports = Oracle;