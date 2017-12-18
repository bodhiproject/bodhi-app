const _ = require('lodash');
const utils = require('../../qweb3.js/src/utils');

class FinalResultSet {
  constructor(blockNum, rawLog) {

    if (!_.isEmpty(rawLog)) {
      this.rawLog = rawLog;
      this.blockNum = blockNum;
      this.decode();
    }
  }

  decode() {
    this.eventAddress = this.rawLog['_eventAddress']
    this.finalResultIndex = this.rawLog['_finalResultIndex'].toNumber();
  }

  translate() {
    return {
      topicAddress: this.eventAddress,
      resultIdx: this.finalResultIndex,
    }
  }
}

module.exports = FinalResultSet;
