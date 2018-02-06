const Web3Utils = require('web3-utils');
const Chai = require('chai');
const ChaiAsPromised = require('chai-as-promised');

const TopicEvent = require('../../api/topic_event');
const ContractUtils = require('./util/contract_utils');
const TestConfig = require('./config/test_config');
const Mocks = require('./mock/bodhi_token');

Chai.use(ChaiAsPromised);
const assert = Chai.assert;
const expect = Chai.expect;

describe('TopicEvent', () => {
  const contractAddress = 'e4ba4d301d4c22d2634a3d8e23c47b7e9e4ef4df';

  describe('withdrawWinnings()', () => {
    it('returns a tx receipt', () => {
      const res = Mocks.withdrawWinnings.result;
      assert.isTrue(ContractUtils.isTxReceipt(res));
    });

    it('throws if contractAddress is undefined', () => {
      expect(TopicEvent.withdrawWinnings({
        senderAddress: TestConfig.SENDER_ADDRESS,
      })).to.be.rejectedWith(Error);
    });

    it('throws if senderAddress is undefined', () => {
      expect(TopicEvent.withdrawWinnings({
        contractAddress,
      })).to.be.rejectedWith(Error);
    });
  });

  describe('totalQtumValue()', () => {
    it('returns the totalQtumValue', () => {
      const res = Mocks.totalQtumValue.result;
      assert.isDefined(res[0]);
      assert.isTrue(Web3Utils.isHex(res[0]));
    });

    it('throws if contractAddress is undefined', () => {
      expect(TopicEvent.totalQtumValue({
        senderAddress: TestConfig.SENDER_ADDRESS,
      })).to.be.rejectedWith(Error);
    });

    it('throws if senderAddress is undefined', () => {
      expect(TopicEvent.totalQtumValue({
        contractAddress,
      })).to.be.rejectedWith(Error);
    });
  });

  describe('totalBotValue()', () => {
    it('returns the totalBotValue', () => {
      const res = Mocks.totalBotValue.result;
      assert.isDefined(res[0]);
      assert.isTrue(Web3Utils.isHex(res[0]));
    });

    it('throws if contractAddress is undefined', () => {
      expect(TopicEvent.totalBotValue({
        senderAddress: TestConfig.SENDER_ADDRESS,
      })).to.be.rejectedWith(Error);
    });

    it('throws if senderAddress is undefined', () => {
      expect(TopicEvent.totalBotValue({
        contractAddress,
      })).to.be.rejectedWith(Error);
    });
  });

  describe('getFinalResult()', () => {
    it('returns the final result and valid flag', () => {
      const res = Mocks.getFinalResult.result;
      assert.isDefined(res[0]);
      assert.isTrue(Web3Utils.isHex(res[0]));
      assert.isDefined(res[1]);
      assert.isBoolean(res[1]);
    });

    it('throws if contractAddress is undefined', () => {
      expect(TopicEvent.getFinalResult({
        senderAddress: TestConfig.SENDER_ADDRESS,
      })).to.be.rejectedWith(Error);
    });

    it('throws if senderAddress is undefined', () => {
      expect(TopicEvent.getFinalResult({
        contractAddress,
      })).to.be.rejectedWith(Error);
    });
  });

  describe('status()', () => {
    it('returns the status', () => {
      const res = Mocks.status.result;
      assert.isDefined(res[0]);
      assert.isTrue(Web3Utils.isHex(res[0]));
    });

    it('throws if contractAddress is undefined', () => {
      expect(TopicEvent.status({
        senderAddress: TestConfig.SENDER_ADDRESS,
      })).to.be.rejectedWith(Error);
    });

    it('throws if senderAddress is undefined', () => {
      expect(TopicEvent.status({
        contractAddress,
      })).to.be.rejectedWith(Error);
    });
  });

  describe('didWithdraw()', () => {
    const address = 'qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy';

    it('returns the didWithdraw flag', () => {
      const res = Mocks.didWithdraw.result;
      assert.isDefined(res[0]);
      assert.isBoolean(res[0]);
    });

    it('throws if contractAddress is undefined', () => {
      expect(TopicEvent.didWithdraw({
        address,
        senderAddress: TestConfig.SENDER_ADDRESS,
      })).to.be.rejectedWith(Error);
    });

    it('throws if address is undefined', () => {
      expect(TopicEvent.didWithdraw({
        contractAddress,
        senderAddress: TestConfig.SENDER_ADDRESS,
      })).to.be.rejectedWith(Error);
    });

    it('throws if senderAddress is undefined', () => {
      expect(TopicEvent.didWithdraw({
        contractAddress,
        address,
      })).to.be.rejectedWith(Error);
    });
  });

  describe('calculateWinnings()', () => {
    it('returns the BOT and QTUM winnings', () => {
      const res = Mocks.calculateWinnings.result;
      assert.isDefined(res[0]);
      assert.isTrue(Web3Utils.isHex(res[0]));
      assert.isDefined(res[1]);
      assert.isTrue(Web3Utils.isHex(res[1]));
    });

    it('throws if contractAddress is undefined', () => {
      expect(TopicEvent.calculateWinnings({
        senderAddress: TestConfig.SENDER_ADDRESS,
      })).to.be.rejectedWith(Error);
    });

    it('throws if senderAddress is undefined', () => {
      expect(TopicEvent.calculateWinnings({
        contractAddress,
      })).to.be.rejectedWith(Error);
    });
  });
});
