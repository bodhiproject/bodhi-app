const _ = require('lodash');
const Web3Utils = require('web3-utils');
const Chai = require('chai');
const ChaiAsPromised = require('chai-as-promised');

const Oracle = require('../../api/oracle');
const TestConfig = require('./config/test_config');
const Mocks = require('./mock/base_contract');

Chai.use(ChaiAsPromised);
const assert = Chai.assert;
const expect = Chai.expect;

const CENTRALIZED = 'centralized';

describe('Oracle', () => {
  const contractAddress = 'a5b27c03e76d4cf10928120439fa96181f07520c';
  const oracleType = CENTRALIZED;

  describe('eventAddress()', () => {
    it('returns the eventAddress', () => {
      const res = Mocks.eventAddress.result;
      assert.isDefined(res[0]);
      assert.isTrue(_.isString(res[0]));
    });

    it('throws if contractAddress is undefined', () => {
      expect(Oracle.eventAddress({
        oracleType,
        senderAddress: TestConfig.SENDER_ADDRESS,
      })).to.be.rejectedWith(Error);
    });

    it('throws if oracleType is undefined', () => {
      expect(Oracle.eventAddress({
        contractAddress,
        senderAddress: TestConfig.SENDER_ADDRESS,
      })).to.be.rejectedWith(Error);
    });

    it('throws if senderAddress is undefined', () => {
      expect(Oracle.eventAddress({
        contractAddress,
        oracleType,
      })).to.be.rejectedWith(Error);
    });
  });

  describe('consensusThreshold()', () => {
    it('returns the consensusThreshold', () => {
      const res = Mocks.consensusThreshold.result;
      assert.isDefined(res[0]);
      assert.isTrue(Web3Utils.isHex(res[0]));
    });

    it('throws if contractAddress is undefined', () => {
      expect(Oracle.consensusThreshold({
        oracleType,
        senderAddress: TestConfig.SENDER_ADDRESS,
      })).to.be.rejectedWith(Error);
    });

    it('throws if oracleType is undefined', () => {
      expect(Oracle.consensusThreshold({
        contractAddress,
        senderAddress: TestConfig.SENDER_ADDRESS,
      })).to.be.rejectedWith(Error);
    });

    it('throws if senderAddress is undefined', () => {
      expect(Oracle.consensusThreshold({
        contractAddress,
        oracleType,
      })).to.be.rejectedWith(Error);
    });
  });

  describe('finished()', () => {
    it('returns the finished flag', () => {
      const res = Mocks.finished.result;
      assert.isDefined(res[0]);
      assert.isBoolean(res[0]);
    });

    it('throws if contractAddress is undefined', () => {
      expect(Oracle.finished({
        oracleType,
        senderAddress: TestConfig.SENDER_ADDRESS,
      })).to.be.rejectedWith(Error);
    });

    it('throws if oracleType is undefined', () => {
      expect(Oracle.finished({
        contractAddress,
        senderAddress: TestConfig.SENDER_ADDRESS,
      })).to.be.rejectedWith(Error);
    });

    it('throws if senderAddress is undefined', () => {
      expect(Oracle.finished({
        contractAddress,
        oracleType,
      })).to.be.rejectedWith(Error);
    });
  });
});
