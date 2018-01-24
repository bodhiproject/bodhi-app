import 'babel-polyfill';
import Chai from 'chai';
import ChaiAsPromised from 'chai-as-promised';

import Wallet from '../../api/wallet';

Chai.use(ChaiAsPromised);
const assert = Chai.assert;
const expect = Chai.expect;

describe('Wallet', () => {
  describe('getAccountAddress()', () => {
    it('returns a qtum address', async () => {
      const res = await Wallet.getAccountAddress({
        accountName: '',
      });
      assert.isDefined(res);
      assert.isString(res);
    });

    it('throws if accountName is undefined', () => {
      expect(Wallet.getAccountAddress()).to.be.rejectedWith(Error);
    });
  });

  describe('listUnspent()', () => {
    it('returns the unspent tx outputs array', async () => {
      const res = await Wallet.listUnspent();
      assert.isDefined(res);
      assert.isArray(res);
    });
  });
});
