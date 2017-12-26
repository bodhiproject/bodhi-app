const _ = require('lodash');

class OracleResultSet {
  constructor(rawLog) {

    if (!_.isEmpty(rawLog)) {
      this.rawLog = rawLog;
      this.decode();
    }
  }

  decode() {
    this.oracleAddress = this.rawLog['_oracleAddress'];
    this.resultIndex = this.rawLog['_resultIndex'].toNumber();
  }

  translate() {
    return {
      oracleAddress: this.oracleAddress,
      resultIdx: this.resultIndex
    }
  }
}

module.exports = OracleResultSet;
