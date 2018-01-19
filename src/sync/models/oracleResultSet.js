const _ = require('lodash');

class OracleResultSet {
  constructor(rawLog) {

    if (!_.isEmpty(rawLog)) {
      this.rawLog = rawLog;
      this.decode();
    }
  }

  decode() {
    this.version = this.rawLog['_version'].toNumber();
    this.oracleAddress = this.rawLog['_oracleAddress'];
    this.resultIndex = this.rawLog['_resultIndex'].toNumber();
  }

  translate() {
    return {
      version: this.version,
      oracleAddress: this.oracleAddress,
      resultIdx: this.resultIndex
    }
  }
}

module.exports = OracleResultSet;
