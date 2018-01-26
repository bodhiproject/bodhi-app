'use strict';

require('babel-polyfill');

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiAsPromised = require('chai-as-promised');

var _chaiAsPromised2 = _interopRequireDefault(_chaiAsPromised);

var _web3Utils = require('web3-utils');

var _web3Utils2 = _interopRequireDefault(_web3Utils);

var _qweb = require('qweb3');

var _centralized_oracle = require('../../api/centralized_oracle');

var _centralized_oracle2 = _interopRequireDefault(_centralized_oracle);

var _contract_utils = require('./util/contract_utils');

var _contract_utils2 = _interopRequireDefault(_contract_utils);

var _test_config = require('./config/test_config');

var _test_config2 = _interopRequireDefault(_test_config);

var _centralized_oracle3 = require('./mock/centralized_oracle');

var _centralized_oracle4 = _interopRequireDefault(_centralized_oracle3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai2.default.use(_chaiAsPromised2.default);
var assert = _chai2.default.assert;
var expect = _chai2.default.expect;

describe('CentralizedOracle', function () {
  var address = 'd78f96ea55ad0c8a283b6d759f39cda34a7c5b10';

  describe('bet()', function () {
    it('returns a tx receipt', function () {
      var res = _centralized_oracle4.default.bet.result;
      assert.isTrue(_contract_utils2.default.isTxReceipt(res));
    });

    it('throws if contractAddress is undefined', function () {
      expect(_centralized_oracle2.default.bet({
        index: 1,
        amount: 1,
        senderAddress: _test_config2.default.SENDER_ADDRESS
      })).to.be.rejectedWith(Error);
    });

    it('throws if index is undefined', function () {
      expect(_centralized_oracle2.default.bet({
        contractAddress: address,
        amount: 1,
        senderAddress: _test_config2.default.SENDER_ADDRESS
      })).to.be.rejectedWith(Error);
    });

    it('throws if amount is undefined', function () {
      expect(_centralized_oracle2.default.bet({
        contractAddress: address,
        index: 1,
        senderAddress: _test_config2.default.SENDER_ADDRESS
      })).to.be.rejectedWith(Error);
    });

    it('throws if senderAddress is undefined', function () {
      expect(_centralized_oracle2.default.bet({
        contractAddress: address,
        index: 1,
        amount: 1
      })).to.be.rejectedWith(Error);
    });
  });

  describe('setResult()', function () {
    it('returns a tx receipt', function () {
      var res = _centralized_oracle4.default.setResult.result;
      assert.isTrue(_contract_utils2.default.isTxReceipt(res));
    });

    it('throws if contractAddress is undefined', function () {
      expect(_centralized_oracle2.default.setResult({
        resultIndex: 1,
        senderAddress: _test_config2.default.SENDER_ADDRESS
      })).to.be.rejectedWith(Error);
    });

    it('throws if resultIndex is undefined', function () {
      expect(_centralized_oracle2.default.setResult({
        contractAddress: address,
        senderAddress: _test_config2.default.SENDER_ADDRESS
      })).to.be.rejectedWith(Error);
    });

    it('throws if senderAddress is undefined', function () {
      expect(_centralized_oracle2.default.setResult({
        contractAddress: address,
        resultIndex: 1
      })).to.be.rejectedWith(Error);
    });
  });

  describe('oracle()', function () {
    it('returns the oracle', function () {
      var res = _centralized_oracle4.default.oracle.result;
      assert.isDefined(res[0]);
      assert.isTrue(_qweb.Decoder.toQtumAddress(res[0]).startsWith('q'));
    });

    it('throws if contractAddress is undefined', function () {
      expect(_centralized_oracle2.default.oracle({
        senderAddress: _test_config2.default.SENDER_ADDRESS
      })).to.be.rejectedWith(Error);
    });

    it('throws if senderAddress is undefined', function () {
      expect(_centralized_oracle2.default.oracle({
        contractAddress: address
      })).to.be.rejectedWith(Error);
    });
  });

  describe('bettingStartBlock()', function () {
    it('returns the bettingStartBlock', function () {
      var res = _centralized_oracle4.default.bettingStartBlock.result;
      assert.isDefined(res[0]);
      assert.isTrue(_web3Utils2.default.isHex(res[0]));
    });

    it('throws if contractAddress is undefined', function () {
      expect(_centralized_oracle2.default.bettingStartBlock({
        senderAddress: _test_config2.default.SENDER_ADDRESS
      })).to.be.rejectedWith(Error);
    });

    it('throws if senderAddress is undefined', function () {
      expect(_centralized_oracle2.default.bettingStartBlock({
        contractAddress: address
      })).to.be.rejectedWith(Error);
    });
  });

  describe('bettingEndBlock()', function () {
    it('returns the bettingEndBlock', function () {
      var res = _centralized_oracle4.default.bettingEndBlock.result;
      assert.isDefined(res[0]);
      assert.isTrue(_web3Utils2.default.isHex(res[0]));
    });

    it('throws if contractAddress is undefined', function () {
      expect(_centralized_oracle2.default.bettingEndBlock({
        senderAddress: _test_config2.default.SENDER_ADDRESS
      })).to.be.rejectedWith(Error);
    });

    it('throws if senderAddress is undefined', function () {
      expect(_centralized_oracle2.default.bettingEndBlock({
        contractAddress: address
      })).to.be.rejectedWith(Error);
    });
  });

  describe('resultSettingStartBlock()', function () {
    it('returns the resultSettingStartBlock', function () {
      var res = _centralized_oracle4.default.resultSettingStartBlock.result;
      assert.isDefined(res[0]);
      assert.isTrue(_web3Utils2.default.isHex(res[0]));
    });

    it('throws if contractAddress is undefined', function () {
      expect(_centralized_oracle2.default.resultSettingStartBlock({
        senderAddress: _test_config2.default.SENDER_ADDRESS
      })).to.be.rejectedWith(Error);
    });

    it('throws if senderAddress is undefined', function () {
      expect(_centralized_oracle2.default.resultSettingStartBlock({
        contractAddress: address
      })).to.be.rejectedWith(Error);
    });
  });

  describe('resultSettingEndBlock()', function () {
    it('returns the resultSettingEndBlock', function () {
      var res = _centralized_oracle4.default.resultSettingEndBlock.result;
      assert.isDefined(res[0]);
      assert.isTrue(_web3Utils2.default.isHex(res[0]));
    });

    it('throws if contractAddress is undefined', function () {
      expect(_centralized_oracle2.default.resultSettingEndBlock({
        senderAddress: _test_config2.default.SENDER_ADDRESS
      })).to.be.rejectedWith(Error);
    });

    it('throws if senderAddress is undefined', function () {
      expect(_centralized_oracle2.default.resultSettingEndBlock({
        contractAddress: address
      })).to.be.rejectedWith(Error);
    });
  });
});