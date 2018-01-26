'use strict';

require('babel-polyfill');

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiAsPromised = require('chai-as-promised');

var _chaiAsPromised2 = _interopRequireDefault(_chaiAsPromised);

var _web3Utils = require('web3-utils');

var _web3Utils2 = _interopRequireDefault(_web3Utils);

var _bodhi_token = require('../../api/bodhi_token');

var _bodhi_token2 = _interopRequireDefault(_bodhi_token);

var _contract_utils = require('./util/contract_utils');

var _contract_utils2 = _interopRequireDefault(_contract_utils);

var _test_config = require('./config/test_config');

var _test_config2 = _interopRequireDefault(_test_config);

var _bodhi_token3 = require('./mock/bodhi_token');

var _bodhi_token4 = _interopRequireDefault(_bodhi_token3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai2.default.use(_chaiAsPromised2.default);
var assert = _chai2.default.assert;
var expect = _chai2.default.expect;

describe('BodhiToken', function () {
  describe('approve()', function () {
    it('returns a tx receipt', function () {
      var res = _bodhi_token4.default.approve.result;
      assert.isTrue(_contract_utils2.default.isTxReceipt(res));
    });

    it('throws if spender is undefined', function () {
      expect(_bodhi_token2.default.approve({
        value: '0',
        senderAddress: _test_config2.default.SENDER_ADDRESS
      })).to.be.rejectedWith(Error);
    });

    it('throws if value is undefined', function () {
      expect(_bodhi_token2.default.approve({
        spender: 'qUDvDKsZQv84iS6mrA2i7ghjgM34mfUxQu',
        senderAddress: _test_config2.default.SENDER_ADDRESS
      })).to.be.rejectedWith(Error);
    });

    it('throws if senderAddress is undefined', function () {
      expect(_bodhi_token2.default.approve({
        spender: 'qUDvDKsZQv84iS6mrA2i7ghjgM34mfUxQu',
        value: '0'
      })).to.be.rejectedWith(Error);
    });
  });

  describe('allowance()', function () {
    it('returns the allowance', function () {
      var res = _bodhi_token4.default.allowance.result;
      assert.isDefined(res.remaining);
      assert.isTrue(_web3Utils2.default.isHex(res.remaining));
    });

    it('throws if owner is undefined', function () {
      expect(_bodhi_token2.default.allowance({
        spender: 'qUDvDKsZQv84iS6mrA2i7ghjgM34mfUxQu',
        senderAddress: _test_config2.default.SENDER_ADDRESS
      })).to.be.rejectedWith(Error);
    });

    it('throws if spender is undefined', function () {
      expect(_bodhi_token2.default.allowance({
        owner: 'qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy',
        senderAddress: _test_config2.default.SENDER_ADDRESS
      })).to.be.rejectedWith(Error);
    });

    it('throws if senderAddress is undefined', function () {
      expect(_bodhi_token2.default.allowance({
        owner: 'qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy',
        spender: 'qUDvDKsZQv84iS6mrA2i7ghjgM34mfUxQu'
      })).to.be.rejectedWith(Error);
    });
  });

  describe('balanceOf()', function () {
    it('returns the allowance', function () {
      var res = _bodhi_token4.default.balanceOf.result;
      assert.isDefined(res.balance);
      assert.isTrue(_web3Utils2.default.isHex(res.balance));
    });

    it('throws if owner is undefined', function () {
      expect(_bodhi_token2.default.balanceOf({
        senderAddress: _test_config2.default.SENDER_ADDRESS
      })).to.be.rejectedWith(Error);
    });

    it('throws if senderAddress is undefined', function () {
      expect(_bodhi_token2.default.balanceOf({
        owner: 'qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy'
      })).to.be.rejectedWith(Error);
    });
  });
});