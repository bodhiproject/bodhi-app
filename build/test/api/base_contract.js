'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

require('babel-polyfill');

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiAsPromised = require('chai-as-promised');

var _chaiAsPromised2 = _interopRequireDefault(_chaiAsPromised);

var _web3Utils = require('web3-utils');

var _web3Utils2 = _interopRequireDefault(_web3Utils);

var _base_contract = require('../../api/base_contract');

var _base_contract2 = _interopRequireDefault(_base_contract);

var _test_config = require('./config/test_config');

var _test_config2 = _interopRequireDefault(_test_config);

var _base_contract3 = require('./mock/base_contract');

var _base_contract4 = _interopRequireDefault(_base_contract3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

_chai2.default.use(_chaiAsPromised2.default);
var assert = _chai2.default.assert;
var expect = _chai2.default.expect;

describe('BaseContract', function () {
  var contractAddress = 'e4ba4d301d4c22d2634a3d8e23c47b7e9e4ef4df';

  describe('version()', function () {
    it('returns the version', function () {
      var res = _base_contract4.default.version.result;
      assert.isDefined(res[0]);
      assert.equal(res[0], 0);
    });

    it('throws if contractAddress is undefined', function () {
      expect(_base_contract2.default.version({
        senderAddress: _test_config2.default.SENDER_ADDRESS
      })).to.be.rejectedWith(Error);
    });

    it('throws if senderAddress is undefined', function () {
      expect(_base_contract2.default.version({
        contractAddress: contractAddress
      })).to.be.rejectedWith(Error);
    });
  });

  describe('resultIndex()', function () {
    it('returns the resultIndex', function () {
      var res = _base_contract4.default.resultIndex.result;
      assert.isDefined(res[0]);
      assert.isTrue(_web3Utils2.default.isHex(res[0]));
    });

    it('throws if contractAddress is undefined', function () {
      expect(_base_contract2.default.resultIndex({
        senderAddress: _test_config2.default.SENDER_ADDRESS
      })).to.be.rejectedWith(Error);
    });

    it('throws if senderAddress is undefined', function () {
      expect(_base_contract2.default.resultIndex({
        contractAddress: contractAddress
      })).to.be.rejectedWith(Error);
    });
  });

  describe('getBetBalances()', function () {
    it('returns the bet balances', function () {
      var res = _base_contract4.default.getBetBalances.result;
      assert.isDefined(res[0]);
      assert.isTrue(_lodash2.default.every(res[0], function (item) {
        return _web3Utils2.default.isHex(item);
      }));
    });

    it('throws if contractAddress is undefined', function () {
      expect(_base_contract2.default.getBetBalances({
        senderAddress: _test_config2.default.SENDER_ADDRESS
      })).to.be.rejectedWith(Error);
    });

    it('throws if senderAddress is undefined', function () {
      expect(_base_contract2.default.getBetBalances({
        contractAddress: contractAddress
      })).to.be.rejectedWith(Error);
    });
  });

  describe('getVoteBalances()', function () {
    it('returns the vote balances', function () {
      var res = _base_contract4.default.getVoteBalances.result;
      assert.isDefined(res[0]);
      assert.isTrue(_lodash2.default.every(res[0], function (item) {
        return _web3Utils2.default.isHex(item);
      }));
    });

    it('throws if contractAddress is undefined', function () {
      expect(_base_contract2.default.getVoteBalances({
        senderAddress: _test_config2.default.SENDER_ADDRESS
      })).to.be.rejectedWith(Error);
    });

    it('throws if senderAddress is undefined', function () {
      expect(_base_contract2.default.getVoteBalances({
        contractAddress: contractAddress
      })).to.be.rejectedWith(Error);
    });
  });

  describe('getTotalBets()', function () {
    it('returns the total bets', function () {
      var res = _base_contract4.default.getTotalBets.result;
      assert.isDefined(res[0]);
      assert.isTrue(_lodash2.default.every(res[0], function (item) {
        return _web3Utils2.default.isHex(item);
      }));
    });

    it('throws if contractAddress is undefined', function () {
      expect(_base_contract2.default.getTotalBets({
        senderAddress: _test_config2.default.SENDER_ADDRESS
      })).to.be.rejectedWith(Error);
    });

    it('throws if senderAddress is undefined', function () {
      expect(_base_contract2.default.getTotalBets({
        contractAddress: contractAddress
      })).to.be.rejectedWith(Error);
    });
  });

  describe('getTotalVotes()', function () {
    it('returns the total votes', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var res;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              res = _base_contract4.default.getTotalVotes.result;

              assert.isDefined(res[0]);
              assert.isTrue(_lodash2.default.every(res[0], function (item) {
                return _web3Utils2.default.isHex(item);
              }));

            case 3:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    })));

    it('throws if contractAddress is undefined', function () {
      expect(_base_contract2.default.getTotalVotes({
        senderAddress: _test_config2.default.SENDER_ADDRESS
      })).to.be.rejectedWith(Error);
    });

    it('throws if senderAddress is undefined', function () {
      expect(_base_contract2.default.getTotalVotes({
        contractAddress: contractAddress
      })).to.be.rejectedWith(Error);
    });
  });
});