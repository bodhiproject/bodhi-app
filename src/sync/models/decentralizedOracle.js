const _ = require('lodash');
const utils = require('../../qweb3.js/src/utils');

class DecentralizedOracle {
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

    this.contractAddress = this.rawLog['_contractAddress'];
    this.eventAddress = this.rawLog['_eventAddress'];
    this.numOfResults = this.rawLog['_numOfResults'].toNumber();
    this.lastResultIndex = this.rawLog['_lastResultIndex'].toNumber();
    this.arbitrationEndBlock = this.rawLog['_arbitrationEndBlock'].toNumber();
    this.consensusThreshold = this.rawLog['_consensusThreshold'].toNumber();
  }

  translate() {
    var optionIdxs = Array.from(Array(this.numOfResults).keys());
    optionIdxs.splice(this.lastResultIndex, 1);

    return {
      address: this.contractAddress,
      topicAddress:this.eventAddress,
      status: 'VOTING',
      token: 'BOT',
      name: this.name,
      options: this.resultNames,
      optionIdxs: optionIdxs,
      amounts: _.fill(Array(this.numOfResults), 0),
      resultIdx: null,
      blockNum: this.blockNum,
      endBlock: this.arbitrationEndBlock,
      consensusThreshold: this.consensusThreshold
    }
  }
}

module.exports = DecentralizedOracle;
