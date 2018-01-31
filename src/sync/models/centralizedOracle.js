/* eslint no-underscore-dangle: 0 */

const _ = require('lodash');
const Decoder = require('qweb3').Decoder;

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
    this.version = this.rawLog._version.toNumber();
    this.contractAddress = this.rawLog._contractAddress;
    this.oracle = this.rawLog._oracle;
    this.eventAddress = this.rawLog._eventAddress;
    this.numOfResults = this.rawLog._numOfResults.toNumber();
    this.bettingStartTime = this.rawLog._bettingStartTime.toNumber();
    this.bettingEndTime = this.rawLog._bettingEndTime.toNumber();
    this.resultSettingStartTime = this.rawLog._resultSettingStartTime.toNumber();
    this.resultSettingEndTime = this.rawLog._resultSettingEndTime.toNumber();
    this.consensusThreshold = this.rawLog._consensusThreshold.toJSON();
  }

  translate() {
    return {
      _id: this.contractAddress,
      version: this.version,
      address: this.contractAddress,
      txid: this.txid,
      topicAddress: this.eventAddress,
      resultSetterAddress: this.oracle,
      resultSetterQAddress: Decoder.toQtumAddress(this.oracle),
      status: 'VOTING',
      token: 'QTUM',
      name: this.name,
      options: this.options,
      optionIdxs: Array.from(Array(this.numOfResults).keys()),
      amounts: _.fill(Array(this.numOfResults), '0'),
      resultIdx: null,
      blockNum: this.blockNum,
      startTime: this.bettingStartTime,
      endTime: this.bettingEndTime,
      resultSetStartTime: this.resultSettingStartTime,
      resultSetEndTime: this.resultSettingEndTime,
      consensusThreshold: this.consensusThreshold,
    };
  }
}

module.exports = CentralizedOracle;
