'use strict';

require('babel-polyfill');

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiAsPromised = require('chai-as-promised');

var _chaiAsPromised2 = _interopRequireDefault(_chaiAsPromised);

var _web3Utils = require('web3-utils');

var _web3Utils2 = _interopRequireDefault(_web3Utils);

var _decentralized_oracle = require('../../api/decentralized_oracle');

var _decentralized_oracle2 = _interopRequireDefault(_decentralized_oracle);

var _contract_utils = require('./util/contract_utils');

var _contract_utils2 = _interopRequireDefault(_contract_utils);

var _test_config = require('./config/test_config');

var _test_config2 = _interopRequireDefault(_test_config);

var _decentralized_oracle3 = require('./mock/decentralized_oracle');

var _decentralized_oracle4 = _interopRequireDefault(_decentralized_oracle3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai2.default.use(_chaiAsPromised2.default);
var assert = _chai2.default.assert;
var expect = _chai2.default.expect;

describe('DecentralizedOracle', function () {
  describe('vote()', function () {
    it('returns a tx receipt', function () {
      var res = _decentralized_oracle4.default.vote.result;
      assert.isTrue(_contract_utils2.default.isTxReceipt(res));
    });

    it('throws if contractAddress is undefined', function () {
      expect(_decentralized_oracle2.default.vote({
        resultIndex: 1,
        botAmount: '5F5E100',
        senderAddress: _test_config2.default.SENDER_ADDRESS
      })).to.be.rejectedWith(Error);
    });

    it('throws if resultIndex is undefined', function () {
      expect(_decentralized_oracle2.default.vote({
        contractAddress: 'e5b0676c6445e6d82b39e8c2a6f7e338bd0a577e',
        botAmount: '5F5E100',
        senderAddress: _test_config2.default.SENDER_ADDRESS
      })).to.be.rejectedWith(Error);
    });

    it('throws if botAmount is undefined', function () {
      expect(_decentralized_oracle2.default.vote({
        contractAddress: 'e5b0676c6445e6d82b39e8c2a6f7e338bd0a577e',
        resultIndex: 1,
        senderAddress: _test_config2.default.SENDER_ADDRESS
      })).to.be.rejectedWith(Error);
    });

    it('throws if senderAddress is undefined', function () {
      expect(_decentralized_oracle2.default.vote({
        contractAddress: 'e5b0676c6445e6d82b39e8c2a6f7e338bd0a577e',
        resultIndex: 1,
        botAmount: '5F5E100'
      })).to.be.rejectedWith(Error);
    });
  });

  describe('finalizeResult()', function () {
    it('returns a tx receipt', function () {
      var res = _decentralized_oracle4.default.finalizeResult.result;
      assert.isTrue(_contract_utils2.default.isTxReceipt(res));
    });

    it('throws if contractAddress is undefined', function () {
      expect(_decentralized_oracle2.default.finalizeResult({
        senderAddress: _test_config2.default.SENDER_ADDRESS
      })).to.be.rejectedWith(Error);
    });

    it('throws if senderAddress is undefined', function () {
      expect(_decentralized_oracle2.default.finalizeResult({
        contractAddress: 'e5b0676c6445e6d82b39e8c2a6f7e338bd0a577e'
      })).to.be.rejectedWith(Error);
    });
  });

  describe('arbitrationEndBlock()', function () {
    it('returns the arbitrationEndBlock', function () {
      var res = _decentralized_oracle4.default.arbitrationEndBlock.result;
      assert.isDefined(res[0]);
      assert.isTrue(_web3Utils2.default.isHex(res[0]));
    });

    it('throws if contractAddress is undefined', function () {
      expect(_decentralized_oracle2.default.arbitrationEndBlock({
        senderAddress: _test_config2.default.SENDER_ADDRESS
      })).to.be.rejectedWith(Error);
    });

    it('throws if senderAddress is undefined', function () {
      expect(_decentralized_oracle2.default.arbitrationEndBlock({
        contractAddress: '814e63497adb7eae5cc217c71d564ee437fb1973'
      })).to.be.rejectedWith(Error);
    });
  });

  describe('lastResultIndex()', function () {
    it('returns the lastResultIndex', function () {
      var res = _decentralized_oracle4.default.lastResultIndex.result;
      assert.isDefined(res[0]);
      assert.isTrue(_web3Utils2.default.isHex(res[0]));
    });

    it('throws if contractAddress is undefined', function () {
      expect(_decentralized_oracle2.default.lastResultIndex({
        senderAddress: _test_config2.default.SENDER_ADDRESS
      })).to.be.rejectedWith(Error);
    });

    it('throws if senderAddress is undefined', function () {
      expect(_decentralized_oracle2.default.lastResultIndex({
        contractAddress: '814e63497adb7eae5cc217c71d564ee437fb1973'
      })).to.be.rejectedWith(Error);
    });
  });
});