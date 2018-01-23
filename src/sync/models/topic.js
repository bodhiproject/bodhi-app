/* eslint no-underscore-dangle: 0 */

const _ = require('lodash');
const Utils = require('qweb3').Utils;

class Topic {
  constructor(blockNum, txid, rawLog) {
    if (!_.isEmpty(rawLog)) {
      this.blockNum = blockNum;
      this.txid = txid;
      this.rawLog = rawLog;
      this.decode();
    }
  }

  decode() {
    this.version = this.rawLog._version.toNumber();
    this.topicAddress = this.rawLog._topicAddress;

    const nameHex = _.reduce(this.rawLog._name, (hexStr, value) => hexStr.concat(value), '');
    this.name = Utils.toUtf8(nameHex);

    const intermedia = _.map(this.rawLog._resultNames, item => Utils.toUtf8(item));
    this.resultNames = _.filter(intermedia, item => !!item);
  }

  translate() {
    return {
      _id: this.topicAddress,
      version: this.version,
      address: this.topicAddress,
      txid: this.txid,
      status: 'VOTING',
      name: this.name,
      options: this.resultNames,
      resultIdx: null,
      qtumAmount: _.fill(Array(this.resultNames.length), '0'),
      botAmount: _.fill(Array(this.resultNames.length), '0'),
      blockNum: this.blockNum,
    };
  }
}

module.exports = Topic;
