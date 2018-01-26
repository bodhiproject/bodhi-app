'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _qweb = require('qweb3');

var _qweb2 = _interopRequireDefault(_qweb);

var _config = require('../config/config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var qClient = new _qweb2.default(_config2.default.QTUM_RPC_ADDRESS);

var Wallet = {
  getAccountAddress: function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(args) {
      var accountName;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              accountName = args.accountName;

              if (!_lodash2.default.isUndefined(accountName)) {
                _context.next = 3;
                break;
              }

              throw new TypeError('accountName needs to be defined');

            case 3:
              return _context.abrupt('return', qClient.getAccountAddress(accountName));

            case 4:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function getAccountAddress(_x) {
      return _ref.apply(this, arguments);
    }

    return getAccountAddress;
  }(),
  listUnspent: function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              return _context2.abrupt('return', qClient.listUnspent());

            case 1:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function listUnspent() {
      return _ref2.apply(this, arguments);
    }

    return listUnspent;
  }()
};

module.exports = Wallet;