const _ = require('lodash');
const Qweb3 = require('qweb3');

const Config = require('../config/config');

const qClient = new Qweb3(Config.QTUM_RPC_ADDRESS);

const Wallet = {
  async getAccountAddress(args) {
    const {
      accountName, // string
    } = args;

    if (_.isUndefined(accountName)) {
      throw new TypeError('accountName needs to be defined');
    }

    return qClient.getAccountAddress(accountName);
  },

  async listUnspent() {
    return qClient.listUnspent();
  },
};

module.exports = Wallet;
