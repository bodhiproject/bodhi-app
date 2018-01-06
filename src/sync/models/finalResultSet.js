const _ = require('lodash');

class FinalResultSet {
  constructor(rawLog) {

    if (!_.isEmpty(rawLog)) {
      this.rawLog = rawLog;
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
