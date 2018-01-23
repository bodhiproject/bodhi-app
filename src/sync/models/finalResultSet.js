/* eslint no-underscore-dangle: 0 */

const _ = require('lodash');

class FinalResultSet {
  constructor(rawLog) {
    if (!_.isEmpty(rawLog)) {
      this.rawLog = rawLog;
      this.decode();
    }
  }

  decode() {
    this.version = this.rawLog._version.toNumber();
    this.eventAddress = this.rawLog._eventAddress;
    this.finalResultIndex = this.rawLog._finalResultIndex.toNumber();
  }

  translate() {
    return {
      version: this.version,
      topicAddress: this.eventAddress,
      resultIdx: this.finalResultIndex,
    };
  }
}

module.exports = FinalResultSet;
