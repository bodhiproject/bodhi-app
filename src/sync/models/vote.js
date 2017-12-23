const _ = require('lodash');
const utils = require('../../qweb3.js/src/utils');

class Vote {
  constructor(blockNum, txid, rawLog) {

    if (!_.isEmpty(rawLog)) {
      this.blockNum = blockNum;
      this.txid = txid;
      this.rawLog = rawLog;
      this.decode();
    }
  }

  decode() {
    this.oracleAddress = this.rawLog['_oracleAddress'];
    this.participant = this.rawLog['_participant'];
    this.resultIndex = this.rawLog['_resultIndex'].toNumber();
    this.votedAmount = this.rawLog['_votedAmount'].toNumber();
  }

  translate() {
    return {
      txid: this.txid,
      voterAddress: this.participant,
      oracleAddress: this.oracleAddress,
      optionIdx: this.resultIndex,
      amount: this.votedAmount,
      blockNum: this.blockNum,
    }
  }
}

module.exports = Vote;
