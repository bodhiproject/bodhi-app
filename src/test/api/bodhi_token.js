const Web3Utils = require('web3-utils');
const Chai = require('chai');
const ChaiAsPromised = require('chai-as-promised');

const BodhiToken = require('../../api/bodhi_token');
const ContractUtils = require('./util/contract_utils');
const TestConfig = require('./config/test_config');
const Mocks = require('./mock/bodhi_token');

Chai.use(ChaiAsPromised);
const assert = Chai.assert;
const expect = Chai.expect;

describe('BodhiToken', () => {
  describe('approve()', () => {
    it('returns a tx receipt', () => {
      const res = Mocks.approve.result;
      assert.isTrue(ContractUtils.isTxReceipt(res));
    });

    it('throws if spender is undefined', () => {
      expect(BodhiToken.approve({
        value: '0',
        senderAddress: TestConfig.SENDER_ADDRESS,
      })).to.be.rejectedWith(Error);
    });

    it('throws if value is undefined', () => {
      expect(BodhiToken.approve({
        spender: 'qUDvDKsZQv84iS6mrA2i7ghjgM34mfUxQu',
        senderAddress: TestConfig.SENDER_ADDRESS,
      })).to.be.rejectedWith(Error);
    });

    it('throws if senderAddress is undefined', () => {
      expect(BodhiToken.approve({
        spender: 'qUDvDKsZQv84iS6mrA2i7ghjgM34mfUxQu',
        value: '0',
      })).to.be.rejectedWith(Error);
    });
  });

  describe('allowance()', () => {
    it('returns the allowance', () => {
      const res = Mocks.allowance.result;
      assert.isDefined(res.remaining);
      assert.isTrue(Web3Utils.isHex(res.remaining));
    });

    it('throws if owner is undefined', () => {
      expect(BodhiToken.allowance({
        spender: 'qUDvDKsZQv84iS6mrA2i7ghjgM34mfUxQu',
        senderAddress: TestConfig.SENDER_ADDRESS,
      })).to.be.rejectedWith(Error);
    });

    it('throws if spender is undefined', () => {
      expect(BodhiToken.allowance({
        owner: 'qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy',
        senderAddress: TestConfig.SENDER_ADDRESS,
      })).to.be.rejectedWith(Error);
    });

    it('throws if senderAddress is undefined', () => {
      expect(BodhiToken.allowance({
        owner: 'qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy',
        spender: 'qUDvDKsZQv84iS6mrA2i7ghjgM34mfUxQu',
      })).to.be.rejectedWith(Error);
    });
  });

  describe('balanceOf()', () => {
    it('returns the allowance', () => {
      const res = Mocks.balanceOf.result;
      assert.isDefined(res.balance);
      assert.isTrue(Web3Utils.isHex(res.balance));
    });

    it('throws if owner is undefined', () => {
      expect(BodhiToken.balanceOf({
        senderAddress: TestConfig.SENDER_ADDRESS,
      })).to.be.rejectedWith(Error);
    });

    it('throws if senderAddress is undefined', () => {
      expect(BodhiToken.balanceOf({
        owner: 'qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy',
      })).to.be.rejectedWith(Error);
    });
  });
});
