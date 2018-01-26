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

var _oracle = require('../../api/oracle');

var _oracle2 = _interopRequireDefault(_oracle);

var _test_config = require('./config/test_config');

var _test_config2 = _interopRequireDefault(_test_config);

var _oracle3 = require('./mock/oracle');

var _oracle4 = _interopRequireDefault(_oracle3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai2.default.use(_chaiAsPromised2.default);
var assert = _chai2.default.assert;
var expect = _chai2.default.expect;

var CENTRALIZED = 'centralized';

describe('Oracle', function () {
  var contractAddress = 'a5b27c03e76d4cf10928120439fa96181f07520c';
  var oracleType = CENTRALIZED;

  describe('eventAddress()', function () {
    it('returns the eventAddress', function () {
      var res = _oracle4.default.eventAddress.result;
      assert.isDefined(res[0]);
      assert.isTrue(_lodash2.default.isString(res[0]));
    });

    it('throws if contractAddress is undefined', function () {
      expect(_oracle2.default.eventAddress({
        oracleType: oracleType,
        senderAddress: _test_config2.default.SENDER_ADDRESS
      })).to.be.rejectedWith(Error);
    });

    it('throws if oracleType is undefined', function () {
      expect(_oracle2.default.eventAddress({
        contractAddress: contractAddress,
        senderAddress: _test_config2.default.SENDER_ADDRESS
      })).to.be.rejectedWith(Error);
    });

    it('throws if senderAddress is undefined', function () {
      expect(_oracle2.default.eventAddress({
        contractAddress: contractAddress,
        oracleType: oracleType
      })).to.be.rejectedWith(Error);
    });
  });

  describe('consensusThreshold()', function () {
    it('returns the consensusThreshold', function () {
      var res = _oracle4.default.consensusThreshold.result;
      assert.isDefined(res[0]);
      assert.isTrue(_web3Utils2.default.isHex(res[0]));
    });

    it('throws if contractAddress is undefined', function () {
      expect(_oracle2.default.consensusThreshold({
        oracleType: oracleType,
        senderAddress: _test_config2.default.SENDER_ADDRESS
      })).to.be.rejectedWith(Error);
    });

    it('throws if oracleType is undefined', function () {
      expect(_oracle2.default.consensusThreshold({
        contractAddress: contractAddress,
        senderAddress: _test_config2.default.SENDER_ADDRESS
      })).to.be.rejectedWith(Error);
    });

    it('throws if senderAddress is undefined', function () {
      expect(_oracle2.default.consensusThreshold({
        contractAddress: contractAddress,
        oracleType: oracleType
      })).to.be.rejectedWith(Error);
    });
  });

  describe('finished()', function () {
    it('returns the finished flag', function () {
      var res = _oracle4.default.finished.result;
      assert.isDefined(res[0]);
      assert.isBoolean(res[0]);
    });

    it('throws if contractAddress is undefined', function () {
      expect(_oracle2.default.finished({
        oracleType: oracleType,
        senderAddress: _test_config2.default.SENDER_ADDRESS
      })).to.be.rejectedWith(Error);
    });

    it('throws if oracleType is undefined', function () {
      expect(_oracle2.default.finished({
        contractAddress: contractAddress,
        senderAddress: _test_config2.default.SENDER_ADDRESS
      })).to.be.rejectedWith(Error);
    });

    it('throws if senderAddress is undefined', function () {
      expect(_oracle2.default.finished({
        contractAddress: contractAddress,
        oracleType: oracleType
      })).to.be.rejectedWith(Error);
    });
  });
});