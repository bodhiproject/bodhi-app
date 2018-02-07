const Web3Utils = require('web3-utils');
const Chai = require('chai');
const ChaiAsPromised = require('chai-as-promised');
const { Decoder } = require('qweb3');

const CentralizedOracle = require('../../api/centralized_oracle');
const ContractUtils = require('./util/contract_utils');
const TestConfig = require('./config/test_config');
const Mocks = require('./mock/centralized_oracle');

Chai.use(ChaiAsPromised);
const assert = Chai.assert;
const expect = Chai.expect;

describe('CentralizedOracle', () => {
  const address = 'd78f96ea55ad0c8a283b6d759f39cda34a7c5b10';

  describe('bet()', () => {
    it('returns a tx receipt', () => {
      const res = Mocks.bet.result;
      assert.isTrue(ContractUtils.isTxReceipt(res));
    });

    it('throws if contractAddress is undefined', () => {
      expect(CentralizedOracle.bet({
        index: 1,
        amount: 1,
        senderAddress: TestConfig.SENDER_ADDRESS,
      })).to.be.rejectedWith(Error);
    });

    it('throws if index is undefined', () => {
      expect(CentralizedOracle.bet({
        contractAddress: address,
        amount: 1,
        senderAddress: TestConfig.SENDER_ADDRESS,
      })).to.be.rejectedWith(Error);
    });

    it('throws if amount is undefined', () => {
      expect(CentralizedOracle.bet({
        contractAddress: address,
        index: 1,
        senderAddress: TestConfig.SENDER_ADDRESS,
      })).to.be.rejectedWith(Error);
    });

    it('throws if senderAddress is undefined', () => {
      expect(CentralizedOracle.bet({
        contractAddress: address,
        index: 1,
        amount: 1,
      })).to.be.rejectedWith(Error);
    });
  });

  describe('setResult()', () => {
    it('returns a tx receipt', () => {
      const res = Mocks.setResult.result;
      assert.isTrue(ContractUtils.isTxReceipt(res));
    });

    it('throws if contractAddress is undefined', () => {
      expect(CentralizedOracle.setResult({
        resultIndex: 1,
        senderAddress: TestConfig.SENDER_ADDRESS,
      })).to.be.rejectedWith(Error);
    });

    it('throws if resultIndex is undefined', () => {
      expect(CentralizedOracle.setResult({
        contractAddress: address,
        senderAddress: TestConfig.SENDER_ADDRESS,
      })).to.be.rejectedWith(Error);
    });

    it('throws if senderAddress is undefined', () => {
      expect(CentralizedOracle.setResult({
        contractAddress: address,
        resultIndex: 1,
      })).to.be.rejectedWith(Error);
    });
  });

  describe('oracle()', () => {
    it('returns the oracle', () => {
      const res = Mocks.oracle.result;
      assert.isDefined(res[0]);
      assert.isTrue(Decoder.toQtumAddress(res[0]).startsWith('q'));
    });

    it('throws if contractAddress is undefined', () => {
      expect(CentralizedOracle.oracle({
        senderAddress: TestConfig.SENDER_ADDRESS,
      })).to.be.rejectedWith(Error);
    });

    it('throws if senderAddress is undefined', () => {
      expect(CentralizedOracle.oracle({
        contractAddress: address,
      })).to.be.rejectedWith(Error);
    });
  });

  describe('bettingStartBlock()', () => {
    it('returns the bettingStartBlock', () => {
      const res = Mocks.bettingStartBlock.result;
      assert.isDefined(res[0]);
      assert.isTrue(Web3Utils.isHex(res[0]));
    });

    it('throws if contractAddress is undefined', () => {
      expect(CentralizedOracle.bettingStartBlock({
        senderAddress: TestConfig.SENDER_ADDRESS,
      })).to.be.rejectedWith(Error);
    });

    it('throws if senderAddress is undefined', () => {
      expect(CentralizedOracle.bettingStartBlock({
        contractAddress: address,
      })).to.be.rejectedWith(Error);
    });
  });

  describe('bettingEndBlock()', () => {
    it('returns the bettingEndBlock', () => {
      const res = Mocks.bettingEndBlock.result;
      assert.isDefined(res[0]);
      assert.isTrue(Web3Utils.isHex(res[0]));
    });

    it('throws if contractAddress is undefined', () => {
      expect(CentralizedOracle.bettingEndBlock({
        senderAddress: TestConfig.SENDER_ADDRESS,
      })).to.be.rejectedWith(Error);
    });

    it('throws if senderAddress is undefined', () => {
      expect(CentralizedOracle.bettingEndBlock({
        contractAddress: address,
      })).to.be.rejectedWith(Error);
    });
  });

  describe('resultSettingStartBlock()', () => {
    it('returns the resultSettingStartBlock', () => {
      const res = Mocks.resultSettingStartBlock.result;
      assert.isDefined(res[0]);
      assert.isTrue(Web3Utils.isHex(res[0]));
    });

    it('throws if contractAddress is undefined', () => {
      expect(CentralizedOracle.resultSettingStartBlock({
        senderAddress: TestConfig.SENDER_ADDRESS,
      })).to.be.rejectedWith(Error);
    });

    it('throws if senderAddress is undefined', () => {
      expect(CentralizedOracle.resultSettingStartBlock({
        contractAddress: address,
      })).to.be.rejectedWith(Error);
    });
  });

  describe('resultSettingEndBlock()', () => {
    it('returns the resultSettingEndBlock', () => {
      const res = Mocks.resultSettingEndBlock.result;
      assert.isDefined(res[0]);
      assert.isTrue(Web3Utils.isHex(res[0]));
    });

    it('throws if contractAddress is undefined', () => {
      expect(CentralizedOracle.resultSettingEndBlock({
        senderAddress: TestConfig.SENDER_ADDRESS,
      })).to.be.rejectedWith(Error);
    });

    it('throws if senderAddress is undefined', () => {
      expect(CentralizedOracle.resultSettingEndBlock({
        contractAddress: address,
      })).to.be.rejectedWith(Error);
    });
  });
});
