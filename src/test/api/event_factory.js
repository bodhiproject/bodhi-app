import 'babel-polyfill';
import Chai from 'chai';
import ChaiAsPromised from 'chai-as-promised';

import ContractUtils from './util/contract_utils';
import Mocks from './mock/event_factory';

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
