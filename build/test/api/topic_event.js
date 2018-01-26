'use strict';

require('babel-polyfill');

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiAsPromised = require('chai-as-promised');

var _chaiAsPromised2 = _interopRequireDefault(_chaiAsPromised);

var _web3Utils = require('web3-utils');

var _web3Utils2 = _interopRequireDefault(_web3Utils);

var _topic_event = require('../../api/topic_event');

var _topic_event2 = _interopRequireDefault(_topic_event);

var _contract_utils = require('./util/contract_utils');

var _contract_utils2 = _interopRequireDefault(_contract_utils);

var _test_config = require('./config/test_config');

var _test_config2 = _interopRequireDefault(_test_config);

var _topic_event3 = require('./mock/topic_event');

var _topic_event4 = _interopRequireDefault(_topic_event3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai2.default.use(_chaiAsPromised2.default);
var assert = _chai2.default.assert;
var expect = _chai2.default.expect;

describe('TopicEvent', function () {
  var contractAddress = 'e4ba4d301d4c22d2634a3d8e23c47b7e9e4ef4df';

  describe('withdrawWinnings()', function () {
    it('returns a tx receipt', function () {
      var res = _topic_event4.default.withdrawWinnings.result;
      assert.isTrue(_contract_utils2.default.isTxReceipt(res));
    });

    it('throws if contractAddress is undefined', function () {
      expect(_topic_event2.default.withdrawWinnings({
        senderAddress: _test_config2.default.SENDER_ADDRESS
      })).to.be.rejectedWith(Error);
    });

    it('throws if senderAddress is undefined', function () {
      expect(_topic_event2.default.withdrawWinnings({
        contractAddress: contractAddress
      })).to.be.rejectedWith(Error);
    });
  });

  describe('totalQtumValue()', function () {
    it('returns the totalQtumValue', function () {
      var res = _topic_event4.default.totalQtumValue.result;
      assert.isDefined(res[0]);
      assert.isTrue(_web3Utils2.default.isHex(res[0]));
    });

    it('throws if contractAddress is undefined', function () {
      expect(_topic_event2.default.totalQtumValue({
        senderAddress: _test_config2.default.SENDER_ADDRESS
      })).to.be.rejectedWith(Error);
    });

    it('throws if senderAddress is undefined', function () {
      expect(_topic_event2.default.totalQtumValue({
        contractAddress: contractAddress
      })).to.be.rejectedWith(Error);
    });
  });

  describe('totalBotValue()', function () {
    it('returns the totalBotValue', function () {
      var res = _topic_event4.default.totalBotValue.result;
      assert.isDefined(res[0]);
      assert.isTrue(_web3Utils2.default.isHex(res[0]));
    });

    it('throws if contractAddress is undefined', function () {
      expect(_topic_event2.default.totalBotValue({
        senderAddress: _test_config2.default.SENDER_ADDRESS
      })).to.be.rejectedWith(Error);
    });

    it('throws if senderAddress is undefined', function () {
      expect(_topic_event2.default.totalBotValue({
        contractAddress: contractAddress
      })).to.be.rejectedWith(Error);
    });
  });

  describe('getFinalResult()', function () {
    it('returns the final result and valid flag', function () {
      var res = _topic_event4.default.getFinalResult.result;
      assert.isDefined(res[0]);
      assert.isTrue(_web3Utils2.default.isHex(res[0]));
      assert.isDefined(res[1]);
      assert.isBoolean(res[1]);
    });

    it('throws if contractAddress is undefined', function () {
      expect(_topic_event2.default.getFinalResult({
        senderAddress: _test_config2.default.SENDER_ADDRESS
      })).to.be.rejectedWith(Error);
    });

    it('throws if senderAddress is undefined', function () {
      expect(_topic_event2.default.getFinalResult({
        contractAddress: contractAddress
      })).to.be.rejectedWith(Error);
    });
  });

  describe('status()', function () {
    it('returns the status', function () {
      var res = _topic_event4.default.status.result;
      assert.isDefined(res[0]);
      assert.isTrue(_web3Utils2.default.isHex(res[0]));
    });

    it('throws if contractAddress is undefined', function () {
      expect(_topic_event2.default.status({
        senderAddress: _test_config2.default.SENDER_ADDRESS
      })).to.be.rejectedWith(Error);
    });

    it('throws if senderAddress is undefined', function () {
      expect(_topic_event2.default.status({
        contractAddress: contractAddress
      })).to.be.rejectedWith(Error);
    });
  });

  describe('didWithdraw()', function () {
    var address = 'qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy';

    it('returns the didWithdraw flag', function () {
      var res = _topic_event4.default.didWithdraw.result;
      assert.isDefined(res[0]);
      assert.isBoolean(res[0]);
    });

    it('throws if contractAddress is undefined', function () {
      expect(_topic_event2.default.didWithdraw({
        address: address,
        senderAddress: _test_config2.default.SENDER_ADDRESS
      })).to.be.rejectedWith(Error);
    });

    it('throws if address is undefined', function () {
      expect(_topic_event2.default.didWithdraw({
        contractAddress: contractAddress,
        senderAddress: _test_config2.default.SENDER_ADDRESS
      })).to.be.rejectedWith(Error);
    });

    it('throws if senderAddress is undefined', function () {
      expect(_topic_event2.default.didWithdraw({
        contractAddress: contractAddress,
        address: address
      })).to.be.rejectedWith(Error);
    });
  });

  describe('calculateWinnings()', function () {
    it('returns the BOT and QTUM winnings', function () {
      var res = _topic_event4.default.calculateWinnings.result;
      assert.isDefined(res[0]);
      assert.isTrue(_web3Utils2.default.isHex(res[0]));
      assert.isDefined(res[1]);
      assert.isTrue(_web3Utils2.default.isHex(res[1]));
    });

    it('throws if contractAddress is undefined', function () {
      expect(_topic_event2.default.calculateWinnings({
        senderAddress: _test_config2.default.SENDER_ADDRESS
      })).to.be.rejectedWith(Error);
    });

    it('throws if senderAddress is undefined', function () {
      expect(_topic_event2.default.calculateWinnings({
        contractAddress: contractAddress
      })).to.be.rejectedWith(Error);
    });
  });
});