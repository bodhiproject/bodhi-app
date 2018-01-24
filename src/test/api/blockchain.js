import 'babel-polyfill';
import Chai from 'chai';
import ChaiAsPromised from 'chai-as-promised';

import Blockchain from '../../api/blockchain';
import Mocks from './mock/blockchain';

Chai.use(ChaiAsPromised);
const assert = Chai.assert;
const expect = Chai.expect;

describe('Blockchain', () => {
  describe('getBlockCount()', () => {
    it('returns the blockcount', async () => {
      const res = await Blockchain.getBlockCount();
      assert.isDefined(res);
      assert.isNumber(res);
    });
  });

  describe('getTransactionReceipt()', () => {
    it('returns the transaction info', () => {
      const res = Mocks.getTransactionReceipt.result;

      assert.isDefined(res);
      assert.isDefined(res[0].blockHash);
      assert.isDefined(res[0].blockNumber);
      assert.isDefined(res[0].transactionHash);
      assert.isDefined(res[0].transactionIndex);
      assert.isDefined(res[0].from);
      assert.isDefined(res[0].to);
      assert.isDefined(res[0].cumulativeGasUsed);
      assert.isDefined(res[0].gasUsed);
      assert.isDefined(res[0].contractAddress);
      assert.isDefined(res[0].log);
      assert.isArray(res[0].log);
    });

    it('throws if transactionId is undefined or empty', () => {
      expect(Blockchain.getTransactionReceipt()).to.be.rejectedWith(Error);
      expect(Blockchain.getTransactionReceipt({ transactionId: undefined })).to.be.rejectedWith(Error);
      expect(Blockchain.getTransactionReceipt({ transactionId: '' })).to.be.rejectedWith(Error);
    });
  });

  describe('searchLogs()', () => {
    it('returns an array of logs', () => {
      const res = Mocks.searchLogs.result;
      assert.isDefined(res);
      assert.isDefined(res[0].blockHash);
      assert.isDefined(res[0].blockNumber);
      assert.isDefined(res[0].transactionHash);
      assert.isDefined(res[0].transactionIndex);
      assert.isDefined(res[0].from);
      assert.isDefined(res[0].to);
      assert.isDefined(res[0].cumulativeGasUsed);
      assert.isDefined(res[0].gasUsed);
      assert.isDefined(res[0].contractAddress);
      assert.isDefined(res[0].log);
      assert.isArray(res[0].log);
    });

    it('throws if fromBlock is not a number', () => {
      expect(Blockchain.searchLogs({
        fromBlock: 'a',
        toBlock: 50100,
        addresses: [],
        topics: ['c46e722c8158268af789d6a68206785f8d497869da236f87c2014c1c08fd3dec'],
      })).to.be.rejectedWith(Error);
    });

    it('throws if toBlock is not a number', () => {
      expect(Blockchain.searchLogs({
        fromBlock: 50000,
        toBlock: 'a',
        addresses: [],
        topics: ['c46e722c8158268af789d6a68206785f8d497869da236f87c2014c1c08fd3dec'],
      })).to.be.rejectedWith(Error);
    });
  });
});
