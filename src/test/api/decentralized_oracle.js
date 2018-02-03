const Web3Utils = require('web3-utils');
const Chai = require('chai');
const ChaiAsPromised = require('chai-as-promised');

const DecentralizedOracle = require('../../api/decentralized_oracle');
const ContractUtils = require('./util/contract_utils');
const TestConfig = require('./config/test_config');
const Mocks = require('./mock/centralized_oracle');

Chai.use(ChaiAsPromised);
const assert = Chai.assert;
const expect = Chai.expect;

describe('DecentralizedOracle', () => {
  describe('vote()', () => {
    it('returns a tx receipt', () => {
      const res = Mocks.vote.result;
      assert.isTrue(ContractUtils.isTxReceipt(res));
    });

    it('throws if contractAddress is undefined', () => {
      expect(DecentralizedOracle.vote({
        resultIndex: 1,
        botAmount: '5F5E100',
        senderAddress: TestConfig.SENDER_ADDRESS,
      })).to.be.rejectedWith(Error);
    });

    it('throws if resultIndex is undefined', () => {
      expect(DecentralizedOracle.vote({
        contractAddress: 'e5b0676c6445e6d82b39e8c2a6f7e338bd0a577e',
        botAmount: '5F5E100',
        senderAddress: TestConfig.SENDER_ADDRESS,
      })).to.be.rejectedWith(Error);
    });

    it('throws if botAmount is undefined', () => {
      expect(DecentralizedOracle.vote({
        contractAddress: 'e5b0676c6445e6d82b39e8c2a6f7e338bd0a577e',
        resultIndex: 1,
        senderAddress: TestConfig.SENDER_ADDRESS,
      })).to.be.rejectedWith(Error);
    });

    it('throws if senderAddress is undefined', () => {
      expect(DecentralizedOracle.vote({
        contractAddress: 'e5b0676c6445e6d82b39e8c2a6f7e338bd0a577e',
        resultIndex: 1,
        botAmount: '5F5E100',
      })).to.be.rejectedWith(Error);
    });
  });

  describe('finalizeResult()', () => {
    it('returns a tx receipt', () => {
      const res = Mocks.finalizeResult.result;
      assert.isTrue(ContractUtils.isTxReceipt(res));
    });

    it('throws if contractAddress is undefined', () => {
      expect(DecentralizedOracle.finalizeResult({
        senderAddress: TestConfig.SENDER_ADDRESS,
      })).to.be.rejectedWith(Error);
    });

    it('throws if senderAddress is undefined', () => {
      expect(DecentralizedOracle.finalizeResult({
        contractAddress: 'e5b0676c6445e6d82b39e8c2a6f7e338bd0a577e',
      })).to.be.rejectedWith(Error);
    });
  });

  describe('arbitrationEndBlock()', () => {
    it('returns the arbitrationEndBlock', () => {
      const res = Mocks.arbitrationEndBlock.result;
      assert.isDefined(res[0]);
      assert.isTrue(Web3Utils.isHex(res[0]));
    });

    it('throws if contractAddress is undefined', () => {
      expect(DecentralizedOracle.arbitrationEndBlock({
        senderAddress: TestConfig.SENDER_ADDRESS,
      })).to.be.rejectedWith(Error);
    });

    it('throws if senderAddress is undefined', () => {
      expect(DecentralizedOracle.arbitrationEndBlock({
        contractAddress: '814e63497adb7eae5cc217c71d564ee437fb1973',
      })).to.be.rejectedWith(Error);
    });
  });

  describe('lastResultIndex()', () => {
    it('returns the lastResultIndex', () => {
      const res = Mocks.lastResultIndex.result;
      assert.isDefined(res[0]);
      assert.isTrue(Web3Utils.isHex(res[0]));
    });

    it('throws if contractAddress is undefined', () => {
      expect(DecentralizedOracle.lastResultIndex({
        senderAddress: TestConfig.SENDER_ADDRESS,
      })).to.be.rejectedWith(Error);
    });

    it('throws if senderAddress is undefined', () => {
      expect(DecentralizedOracle.lastResultIndex({
        contractAddress: '814e63497adb7eae5cc217c71d564ee437fb1973',
      })).to.be.rejectedWith(Error);
    });
  });
});
