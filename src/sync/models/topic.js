const _ = require('lodash');
const utils = require('../../qweb3.js/src/utils');

class Topic {
  constructor(blockNum, rawLog) {

    if (!_.isEmpty(rawLog)) {
      this.rawLog = rawLog;
      this.blockNum = blockNum;
      this.decode();
    }
  }

  decode() {
    let nameHex = _.reduce(this.rawLog['_name'], (hexStr, value) => {
      let valStr = value;
      if (valStr.indexOf('0x') === 0) {
        valStr = valStr.slice(2);
      }
      return hexStr += valStr;
    }, '');
    this.name = _.trimEnd(utils.toAscii(nameHex), '\u0000');
    let intermedia = _.map(this.rawLog['_resultNames'], (item) => _.trimEnd(utils.toAscii(item), '\u0000'));
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
      creatorAddress: this.creator,
      status: 'VOTING',
      name: this.name,
      options: this.resultNames,
      resultIdx: null,
      qtumAmount: _.fill(Array(this.resultNames.length), 0),
      botAmount:_.fill(Array(this.resultNames.length), 0),
      blockNum: this.blockNum,
    }
  }
}

module.exports = Topic;
