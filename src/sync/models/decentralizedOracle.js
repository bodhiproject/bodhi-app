const _ = require('lodash');
const utils = require('../../qweb3.js/src/utils');

class DecentralizedOracle {
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
    this.name =utils.toUtf8(nameHex);
    let intermedia = _.map(this.rawLog['_resultNames'], (item) => utils.toUtf8(item));
    this.resultNames = _.filter(intermedia, item => !!item);

    this.contractAddress = this.rawLog['_contractAddress'];
    this.eventAddress = this.rawLog['_eventAddress'];
    this.numOfResults = this.rawLog['_numOfResults'].toNumber();
    this.lastResultIndex = this.rawLog['_lastResultIndex'].toNumber();
    this.arbitrationEndBlock = this.rawLog['_arbitrationEndBlock'].toNumber();
    this.consensusThreshold = this.rawLog['_consensusThreshold'].toJSON();
  }

  translate() {
    var optionIdxs = Array.from(Array(this.numOfResults).keys());
    optionIdxs.splice(this.lastResultIndex, 1);

    return {
      address: this.contractAddress,
      txid: this.txid,
      topicAddress:this.eventAddress,
      status: 'VOTING',
      token: 'BOT',
      name: this.name,
      options: this.resultNames,
      optionIdxs: optionIdxs,
      amounts: _.fill(Array(this.numOfResults), '0'),
      resultIdx: null,
      blockNum: this.blockNum,
      endBlock: this.arbitrationEndBlock,
      consensusThreshold: this.consensusThreshold
    }
  }
}

module.exports = DecentralizedOracle;
