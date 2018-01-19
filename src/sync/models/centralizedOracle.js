const _ = require('lodash');
const Decoder = require('qweb3').Decoder;
const Utils = require('qweb3').Utils;

class CentralizedOracle {
  constructor(blockNum, txid, rawLog) {

    if (!_.isEmpty(rawLog)) {
      this.txid = txid;
      this.blockNum = blockNum;
      this.rawLog = rawLog;
      this.decode();
    }
  }

  decode() {
    this.version = this.rawLog['_version'].toNumber();
    this.contractAddress = this.rawLog['_contractAddress'];
    this.oracle = this.rawLog['_oracle'];
    this.eventAddress = this.rawLog['_eventAddress'];
    this.numOfResults = this.rawLog['_numOfResults'].toNumber();
    this.bettingStartBlock = this.rawLog['_bettingStartBlock'].toNumber();
    this.bettingEndBlock = this.rawLog['_bettingEndBlock'].toNumber();
    this.resultSettingStartBlock = this.rawLog['_resultSettingStartBlock'].toNumber();
    this.resultSettingEndBlock = this.rawLog['_resultSettingEndBlock'].toNumber();
    this.consensusThreshold = this.rawLog['_consensusThreshold'].toJSON();
  }

  translate() {
    return {
      _id : this.contractAddress,
      version: this.version,
      address: this.contractAddress,
      txid: this.txid,
      topicAddress:this.eventAddress,
      resultSetterAddress:this.oracle,
      resultSetterQAddress: Decoder.toQtumAddress(this.oracle),
      status: 'VOTING',
      token: 'QTUM',
      name: this.name,
      options: this.options,
      optionIdxs: Array.from(Array(this.numOfResults).keys()),
      amounts: _.fill(Array(this.numOfResults), '0'),
      resultIdx: null,
      blockNum: this.blockNum,
      startBlock: this.bettingStartBlock,
      endBlock: this.bettingEndBlock,
      resultSetStartBlock: this.resultSettingStartBlock,
      resultSetEndBlock: this.resultSettingEndBlock,
      consensusThreshold: this.consensusThreshold
    }
  }
}

module.exports = CentralizedOracle;
