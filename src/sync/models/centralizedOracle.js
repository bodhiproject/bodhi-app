const _ = require('lodash');
const qDecoder = require('../../qweb3.js/src/decoder');
const utils = require('../../qweb3.js/src/utils');

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
    let nameHex = _.reduce(this.rawLog['_name'], (hexStr, value) => {
      return hexStr += value;
    }, '');
    this.name = utils.toUtf8(nameHex);

    let intermedia = _.map(this.rawLog['_resultNames'], (item) => utils.toUtf8(item));
    this.resultNames = _.filter(intermedia, item => !!item);

    this.contractAddress = this.rawLog['_contractAddress'];
    this.oracle = this.rawLog['_oracle'];
    this.eventAddress = this.rawLog['_eventAddress'];
    this.numOfResults = this.rawLog['_numOfResults'].toNumber();
    this.bettingEndBlock = this.rawLog['_bettingEndBlock'].toNumber();
    this.resultSettingEndBlock = this.rawLog['_resultSettingEndBlock'].toNumber();
    this.consensusThreshold = this.rawLog['_consensusThreshold'].toJSON();
  }

  translate() {
    return {
      address: this.contractAddress,
      txid: this.txid,
      topicAddress:this.eventAddress,
      resultSetterAddress:this.oracle,
      resultSetterQAddress: qDecoder.toQtumAddress(this.oracle),
      status: 'VOTING',
      token: 'QTUM',
      name: this.name,
      options: this.resultNames,
      optionIdxs: Array.from(Array(this.numOfResults).keys()),
      amounts: _.fill(Array(this.numOfResults), '0'),
      resultIdx: null,
      blockNum: this.blockNum,
      endBlock: this.bettingEndBlock,
      resultSetEndBlock: this.resultSettingEndBlock,
      consensusThreshold: this.consensusThreshold
    }
  }
}

module.exports = CentralizedOracle;
