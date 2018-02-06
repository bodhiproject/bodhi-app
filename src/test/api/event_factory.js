const Chai = require('chai');
const ChaiAsPromised = require('chai-as-promised');

const ContractUtils = require('./util/contract_utils');
const Mocks = require('./mock/centralized_oracle');

Chai.use(ChaiAsPromised);
const assert = Chai.assert;

describe('EventFactory', () => {
  describe('createTopic()', () => {
    it('returns a tx receipt', () => {
      const res = Mocks.createTopic.result;
      assert.isTrue(ContractUtils.isTxReceipt(res));
    });
  });
});
