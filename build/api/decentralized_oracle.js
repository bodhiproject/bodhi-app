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

var GAS_LIMIT_VOTE = 1500000;

function getContract(contractAddress) {
  return new _qweb.Contract(_config2.default.QTUM_RPC_ADDRESS, contractAddress, _contract_metadata2.default.DecentralizedOracle.abi);
}

var DecentralizedOracle = {
  vote: function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(args) {
      var contractAddress, resultIndex, botAmount, gasLimit, senderAddress, contract;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              contractAddress = args.contractAddress, resultIndex = args.resultIndex, botAmount = args.botAmount, gasLimit = args.gasLimit, senderAddress = args.senderAddress;

              if (!_lodash2.default.isUndefined(contractAddress)) {
                _context.next = 3;
                break;
              }

              throw new TypeError('contractAddress needs to be defined');

            case 3:
              if (!_lodash2.default.isUndefined(resultIndex)) {
                _context.next = 5;
                break;
              }

              throw new TypeError('resultIndex needs to be defined');

            case 5:
              if (!_lodash2.default.isUndefined(botAmount)) {
                _context.next = 7;
                break;
              }

              throw new TypeError('botAmount needs to be defined');

            case 7:
              if (!_lodash2.default.isUndefined(senderAddress)) {
                _context.next = 9;
                break;
              }

              throw new TypeError('senderAddress needs to be defined');

            case 9:

              // If gasLimit is not specified, we need to make sure the vote succeeds in the event this vote will surpass the
              // consensus threshold and will require a higher gas limit.
              contract = getContract(contractAddress);
              return _context.abrupt('return', contract.send('voteResult', {
                methodArgs: [resultIndex, botAmount],
                gasLimit: gasLimit || GAS_LIMIT_VOTE,
                senderAddress: senderAddress
              }));

            case 11:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function vote(_x) {
      return _ref.apply(this, arguments);
    }

    return vote;
  }(),
  finalizeResult: function () {
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
              return _context2.abrupt('return', contract.send('finalizeResult', {
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

    function finalizeResult(_x2) {
      return _ref2.apply(this, arguments);
    }

    return finalizeResult;
  }(),
  arbitrationEndBlock: function () {
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
              return _context3.abrupt('return', contract.call('arbitrationEndBlock', {
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

    function arbitrationEndBlock(_x3) {
      return _ref3.apply(this, arguments);
    }

    return arbitrationEndBlock;
  }(),
  lastResultIndex: function () {
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
              return _context4.abrupt('return', contract.call('lastResultIndex', {
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

    function lastResultIndex(_x4) {
      return _ref4.apply(this, arguments);
    }

    return lastResultIndex;
  }()
};

module.exports = DecentralizedOracle;