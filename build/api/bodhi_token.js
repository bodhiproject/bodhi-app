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

var contract = new _qweb.Contract(_config2.default.QTUM_RPC_ADDRESS, _contract_metadata2.default.BodhiToken.address, _contract_metadata2.default.BodhiToken.abi);

var BodhiToken = {
  approve: function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(args) {
      var spender, value, senderAddress;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              spender = args.spender, value = args.value, senderAddress = args.senderAddress;

              if (!_lodash2.default.isUndefined(spender)) {
                _context.next = 3;
                break;
              }

              throw new TypeError('spender needs to be defined');

            case 3:
              if (!_lodash2.default.isUndefined(value)) {
                _context.next = 5;
                break;
              }

              throw new TypeError('value needs to be defined');

            case 5:
              if (!_lodash2.default.isUndefined(senderAddress)) {
                _context.next = 7;
                break;
              }

              throw new TypeError('senderAddress needs to be defined');

            case 7:
              return _context.abrupt('return', contract.send('approve', {
                methodArgs: [spender, value],
                senderAddress: senderAddress
              }));

            case 8:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function approve(_x) {
      return _ref.apply(this, arguments);
    }

    return approve;
  }(),
  allowance: function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(args) {
      var owner, spender, senderAddress;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              owner = args.owner, spender = args.spender, senderAddress = args.senderAddress;

              if (!_lodash2.default.isUndefined(owner)) {
                _context2.next = 3;
                break;
              }

              throw new TypeError('owner needs to be defined');

            case 3:
              if (!_lodash2.default.isUndefined(spender)) {
                _context2.next = 5;
                break;
              }

              throw new TypeError('spender needs to be defined');

            case 5:
              if (!_lodash2.default.isUndefined(senderAddress)) {
                _context2.next = 7;
                break;
              }

              throw new TypeError('senderAddress needs to be defined');

            case 7:
              return _context2.abrupt('return', contract.call('allowance', {
                methodArgs: [owner, spender],
                senderAddress: senderAddress
              }));

            case 8:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function allowance(_x2) {
      return _ref2.apply(this, arguments);
    }

    return allowance;
  }(),
  balanceOf: function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(args) {
      var owner, senderAddress;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              owner = args.owner, senderAddress = args.senderAddress;

              if (!_lodash2.default.isUndefined(owner)) {
                _context3.next = 3;
                break;
              }

              throw new TypeError('owner needs to be defined');

            case 3:
              if (!_lodash2.default.isUndefined(senderAddress)) {
                _context3.next = 5;
                break;
              }

              throw new TypeError('senderAddress needs to be defined');

            case 5:
              return _context3.abrupt('return', contract.call('balanceOf', {
                methodArgs: [owner],
                senderAddress: senderAddress
              }));

            case 6:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function balanceOf(_x3) {
      return _ref3.apply(this, arguments);
    }

    return balanceOf;
  }()
};

module.exports = BodhiToken;