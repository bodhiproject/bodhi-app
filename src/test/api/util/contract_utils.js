const _ = require('lodash');

const ContractUtils = {
  isTxReceipt(txReceipt) {
    return !_.isUndefined(txReceipt)
      && !_.isUndefined(txReceipt.txid)
      && !_.isUndefined(txReceipt.sender)
      && !_.isUndefined(txReceipt.hash160);
  },
};

module.exports = ContractUtils;
