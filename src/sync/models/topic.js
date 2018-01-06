const _ = require('lodash');
const Decoder = require('qweb3').Decoder;
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
    let nameHex = _.reduce(this.rawLog['_name'], (hexStr, value) => {
      return hexStr += value;
    }, '');
    this.name = Utils.toUtf8(nameHex)
    let intermedia = _.map(this.rawLog['_resultNames'], (item) => Utils.toUtf8(item));
    this.resultNames = _.filter(intermedia, item => !!item);

    this.topicAddress = this.rawLog['_topicAddress'];
    this.creator = this.rawLog['_creator'];
    this.oracle = this.rawLog['_oracle'];
    this.bettingEndBlock = this.rawLog['_bettingEndBlock'].toNumber();
    this.resultSettingEndBlock = this.rawLog['_resultSettingEndBlock'].toNumber();
  }

  translate() {
    return {
      address: this.topicAddress,
      txid: this.txid,
      creatorAddress: this.creator,
      creatorQAddress: Decoder.toQtumAddress(this.creator),
      status: 'VOTING',
      name: this.name,
      options: this.resultNames,
      resultIdx: null,
      qtumAmount: _.fill(Array(this.resultNames.length), '0'),
      botAmount:_.fill(Array(this.resultNames.length), '0'),
      blockNum: this.blockNum,
    }
  }
}

module.exports = Topic;
