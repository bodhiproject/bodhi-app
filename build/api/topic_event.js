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
  return new _qweb.Contract(_config2.default.QTUM_RPC_ADDRESS, contractAddress, _contract_metadata2.default.TopicEvent.abi);
}

var TopicEvent = {
  withdrawWinnings: function () {
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
              return _context.abrupt('return', contract.send('withdrawWinnings', {
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

    function withdrawWinnings(_x) {
      return _ref.apply(this, arguments);
    }

    return withdrawWinnings;
  }(),
  totalQtumValue: function () {
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
              return _context2.abrupt('return', contract.call('totalQtumValue', {
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

    function totalQtumValue(_x2) {
      return _ref2.apply(this, arguments);
    }

    return totalQtumValue;
  }(),
  totalBotValue: function () {
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
              return _context3.abrupt('return', contract.call('totalBotValue', {
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

    function totalBotValue(_x3) {
      return _ref3.apply(this, arguments);
    }

    return totalBotValue;
  }(),
  getFinalResult: function () {
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
              return _context4.abrupt('return', contract.call('getFinalResult', {
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

    function getFinalResult(_x4) {
      return _ref4.apply(this, arguments);
    }

    return getFinalResult;
  }(),
  status: function () {
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
              return _context5.abrupt('return', contract.call('status', {
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

    function status(_x5) {
      return _ref5.apply(this, arguments);
    }

    return status;
  }(),
  didWithdraw: function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(args) {
      var contractAddress, address, senderAddress, contract;
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              contractAddress = args.contractAddress, address = args.address, senderAddress = args.senderAddress;

              if (!_lodash2.default.isUndefined(contractAddress)) {
                _context6.next = 3;
                break;
              }

              throw new TypeError('contractAddress needs to be defined');

            case 3:
              if (!_lodash2.default.isUndefined(address)) {
                _context6.next = 5;
                break;
              }

              throw new TypeError('address needs to be defined');

            case 5:
              if (!_lodash2.default.isUndefined(senderAddress)) {
                _context6.next = 7;
                break;
              }

              throw new TypeError('senderAddress needs to be defined');

            case 7:
              contract = getContract(contractAddress);
              return _context6.abrupt('return', contract.call('didWithdraw', {
                methodArgs: [address],
                senderAddress: senderAddress
              }));

            case 9:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee6, this);
    }));

    function didWithdraw(_x6) {
      return _ref6.apply(this, arguments);
    }

    return didWithdraw;
  }(),
  calculateWinnings: function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(args) {
      var contractAddress, senderAddress, contract;
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              contractAddress = args.contractAddress, senderAddress = args.senderAddress;

              if (!_lodash2.default.isUndefined(contractAddress)) {
                _context7.next = 3;
                break;
              }

              throw new TypeError('contractAddress needs to be defined');

            case 3:
              if (!_lodash2.default.isUndefined(senderAddress)) {
                _context7.next = 5;
                break;
              }

              throw new TypeError('senderAddress needs to be defined');

            case 5:
              contract = getContract(contractAddress);
              return _context7.abrupt('return', contract.call('calculateWinnings', {
                methodArgs: [],
                senderAddress: senderAddress
              }));

            case 7:
            case 'end':
              return _context7.stop();
          }
        }
      }, _callee7, this);
    }));

    function calculateWinnings(_x7) {
      return _ref7.apply(this, arguments);
    }

    return calculateWinnings;
  }()
};

module.exports = TopicEvent;