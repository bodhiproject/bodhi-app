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

var GAS_LIMIT_CREATE_TOPIC = 3500000;

var contract = new _qweb.Contract(_config2.default.QTUM_RPC_ADDRESS, _contract_metadata2.default.EventFactory.address, _contract_metadata2.default.EventFactory.abi);

var EventFactory = {
  createTopic: function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(args) {
      var oracleAddress, eventName, resultNames, bettingStartBlock, bettingEndBlock, resultSettingStartBlock, resultSettingEndBlock, senderAddress;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              oracleAddress = args.oracleAddress, eventName = args.eventName, resultNames = args.resultNames, bettingStartBlock = args.bettingStartBlock, bettingEndBlock = args.bettingEndBlock, resultSettingStartBlock = args.resultSettingStartBlock, resultSettingEndBlock = args.resultSettingEndBlock, senderAddress = args.senderAddress;

              if (!_lodash2.default.isUndefined(oracleAddress)) {
                _context.next = 3;
                break;
              }

              throw new TypeError('oracleAddress needs to be defined');

            case 3:
              if (!_lodash2.default.isUndefined(eventName)) {
                _context.next = 5;
                break;
              }

              throw new TypeError('eventName needs to be defined');

            case 5:
              if (!_lodash2.default.isUndefined(resultNames)) {
                _context.next = 7;
                break;
              }

              throw new TypeError('resultNames needs to be defined');

            case 7:
              if (!_lodash2.default.isUndefined(bettingStartBlock)) {
                _context.next = 9;
                break;
              }

              throw new TypeError('bettingStartBlock needs to be defined');

            case 9:
              if (!_lodash2.default.isUndefined(bettingEndBlock)) {
                _context.next = 11;
                break;
              }

              throw new TypeError('bettingEndBlock needs to be defined');

            case 11:
              if (!_lodash2.default.isUndefined(resultSettingStartBlock)) {
                _context.next = 13;
                break;
              }

              throw new TypeError('resultSettingStartBlock needs to be defined');

            case 13:
              if (!_lodash2.default.isUndefined(resultSettingEndBlock)) {
                _context.next = 15;
                break;
              }

              throw new TypeError('resultSettingEndBlock needs to be defined');

            case 15:
              if (!_lodash2.default.isUndefined(senderAddress)) {
                _context.next = 17;
                break;
              }

              throw new TypeError('senderAddress needs to be defined');

            case 17:
              return _context.abrupt('return', contract.send('createTopic', {
                methodArgs: [oracleAddress, eventName, resultNames, bettingStartBlock, bettingEndBlock, resultSettingStartBlock, resultSettingEndBlock],
                gasLimit: GAS_LIMIT_CREATE_TOPIC,
                senderAddress: senderAddress
              }));

            case 18:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function createTopic(_x) {
      return _ref.apply(this, arguments);
    }

    return createTopic;
  }()
};

module.exports = EventFactory;