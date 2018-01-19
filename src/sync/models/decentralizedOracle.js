const _ = require('lodash');
const Utils = require('qweb3').Utils;

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
    this.version = this.rawLog['_version'].toNumber();
    this.contractAddress = this.rawLog['_contractAddress'];
    this.eventAddress = this.rawLog['_eventAddress'];
    this.numOfResults = this.rawLog['_numOfResults'].toNumber();
    this.lastResultIndex = this.rawLog['_lastResultIndex'].toNumber();
    this.arbitrationEndBlock = this.rawLog['_arbitrationEndBlock'].toNumber();
    this.consensusThreshold = this.rawLog['_consensusThreshold'].toJSON();
  }

  translate() {
    let optionIdxs = Array.from(Array(this.numOfResults).keys());
    _.remove(optionIdxs, (num) => {
      return num === this.lastResultIndex;
    });

    return {
      _id: this.contractAddress,
      version: this.version,
      address: this.contractAddress,
      txid: this.txid,
      topicAddress:this.eventAddress,
      status: 'VOTING',
      token: 'BOT',
      name: this.name,
      options: this.options,
      optionIdxs: optionIdxs,
      amounts: _.fill(Array(this.numOfResults), '0'),
      resultIdx: null,
      blockNum: this.blockNum,
      startBlock: this.blockNum,
      endBlock: this.arbitrationEndBlock,
      consensusThreshold: this.consensusThreshold
    }
  }
}

module.exports = DecentralizedOracle;
