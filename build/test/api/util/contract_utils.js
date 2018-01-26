'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ContractUtils = {
  isTxReceipt: function isTxReceipt(txReceipt) {
    return !_lodash2.default.isUndefined(txReceipt) && !_lodash2.default.isUndefined(txReceipt.txid) && !_lodash2.default.isUndefined(txReceipt.sender) && !_lodash2.default.isUndefined(txReceipt.hash160);
  }
};

module.exports = ContractUtils;