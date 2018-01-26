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

function getContract(contractAddress) {
  return new _qweb.Contract(_config2.default.QTUM_RPC_ADDRESS, contractAddress, _contract_metadata2.default.BaseContract.abi);
}

var BaseContract = {
  version: function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(args) {
      var contractAddress, senderAddress, contract;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              contractAddress = args.contractAddress, senderAddress = args.senderAddress;

              if (!_lodash2.default.isUndefined(contractAddress)) {
                _context.next = 3;
                break;
              }

              throw new TypeError('contractAddress needs to be defined');

            case 3:
              if (!_lodash2.default.isUndefined(senderAddress)) {
                _context.next = 5;
                break;
              }

              throw new TypeError('senderAddress needs to be defined');

            case 5:
              contract = getContract(contractAddress);
              return _context.abrupt('return', contract.call('version', {
                methodArgs: [],
                senderAddress: senderAddress
              }));

            case 7:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function version(_x) {
      return _ref.apply(this, arguments);
    }

    return version;
  }(),
  resultIndex: function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(args) {
      var contractAddress, senderAddress, contract;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              contractAddress = args.contractAddress, senderAddress = args.senderAddress;

              if (!_lodash2.default.isUndefined(contractAddress)) {
                _context2.next = 3;
                break;
              }

              throw new TypeError('contractAddress needs to be defined');

            case 3:
              if (!_lodash2.default.isUndefined(senderAddress)) {
                _context2.next = 5;
                break;
              }

              throw new TypeError('senderAddress needs to be defined');

            case 5:
              contract = getContract(contractAddress);
              return _context2.abrupt('return', contract.call('resultIndex', {
                methodArgs: [],
                senderAddress: senderAddress
              }));

            case 7:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function resultIndex(_x2) {
      return _ref2.apply(this, arguments);
    }

    return resultIndex;
  }(),
  getBetBalances: function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(args) {
      var contractAddress, senderAddress, contract;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              contractAddress = args.contractAddress, senderAddress = args.senderAddress;

              if (!_lodash2.default.isUndefined(contractAddress)) {
                _context3.next = 3;
                break;
              }

              throw new TypeError('contractAddress needs to be defined');

            case 3:
              if (!_lodash2.default.isUndefined(senderAddress)) {
                _context3.next = 5;
                break;
              }

              throw new TypeError('senderAddress needs to be defined');

            case 5:
              contract = getContract(contractAddress);
              return _context3.abrupt('return', contract.call('getBetBalances', {
                methodArgs: [],
                senderAddress: senderAddress
              }));

            case 7:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function getBetBalances(_x3) {
      return _ref3.apply(this, arguments);
    }

    return getBetBalances;
  }(),
  getVoteBalances: function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(args) {
      var contractAddress, senderAddress, contract;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              contractAddress = args.contractAddress, senderAddress = args.senderAddress;

              if (!_lodash2.default.isUndefined(contractAddress)) {
                _context4.next = 3;
                break;
              }

              throw new TypeError('contractAddress needs to be defined');

            case 3:
              if (!_lodash2.default.isUndefined(senderAddress)) {
                _context4.next = 5;
                break;
              }

              throw new TypeError('senderAddress needs to be defined');

            case 5:
              contract = getContract(contractAddress);
              return _context4.abrupt('return', contract.call('getVoteBalances', {
                methodArgs: [],
                senderAddress: senderAddress
              }));

            case 7:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    function getVoteBalances(_x4) {
      return _ref4.apply(this, arguments);
    }

    return getVoteBalances;
  }(),
  getTotalBets: function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(args) {
      var contractAddress, senderAddress, contract;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              contractAddress = args.contractAddress, senderAddress = args.senderAddress;

              if (!_lodash2.default.isUndefined(contractAddress)) {
                _context5.next = 3;
                break;
              }

              throw new TypeError('contractAddress needs to be defined');

            case 3:
              if (!_lodash2.default.isUndefined(senderAddress)) {
                _context5.next = 5;
                break;
              }

              throw new TypeError('senderAddress needs to be defined');

            case 5:
              contract = getContract(contractAddress);
              return _context5.abrupt('return', contract.call('getTotalBets', {
                methodArgs: [],
                senderAddress: senderAddress
              }));

            case 7:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, this);
    }));

    function getTotalBets(_x5) {
      return _ref5.apply(this, arguments);
    }

    return getTotalBets;
  }(),
  getTotalVotes: function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(args) {
      var contractAddress, senderAddress, contract;
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              contractAddress = args.contractAddress, senderAddress = args.senderAddress;

              if (!_lodash2.default.isUndefined(contractAddress)) {
                _context6.next = 3;
                break;
              }

              throw new TypeError('contractAddress needs to be defined');

            case 3:
              if (!_lodash2.default.isUndefined(senderAddress)) {
                _context6.next = 5;
                break;
              }

              throw new TypeError('senderAddress needs to be defined');

            case 5:
              contract = getContract(contractAddress);
              return _context6.abrupt('return', contract.call('getTotalVotes', {
                methodArgs: [],
                senderAddress: senderAddress
              }));

            case 7:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee6, this);
    }));

    function getTotalVotes(_x6) {
      return _ref6.apply(this, arguments);
    }

    return getTotalVotes;
  }()
};

module.exports = BaseContract;