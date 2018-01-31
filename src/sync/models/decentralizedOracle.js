/* eslint no-underscore-dangle: 0 */

const _ = require('lodash');

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
    this.version = this.rawLog._version.toNumber();
    this.contractAddress = this.rawLog._contractAddress;
    this.eventAddress = this.rawLog._eventAddress;
    this.numOfResults = this.rawLog._numOfResults.toNumber();
    this.lastResultIndex = this.rawLog._lastResultIndex.toNumber();
    this.arbitrationEndTime = this.rawLog._arbitrationEndTime.toNumber();
    this.consensusThreshold = this.rawLog._consensusThreshold.toJSON();
  }

  translate() {
    const optionIdxs = Array.from(Array(this.numOfResults).keys());
    _.remove(optionIdxs, num => num === this.lastResultIndex);

    return {
      _id: this.contractAddress,
      version: this.version,
      address: this.contractAddress,
      txid: this.txid,
      topicAddress: this.eventAddress,
      status: 'VOTING',
      token: 'BOT',
      name: this.name,
      options: this.options,
      optionIdxs,
      amounts: _.fill(Array(this.numOfResults), '0'),
      resultIdx: null,
      blockNum: this.blockNum,
      startTime: this.startTime,
      endTime: this.arbitrationEndTime,
      consensusThreshold: this.consensusThreshold,
    };
  }
}

module.exports = DecentralizedOracle;
