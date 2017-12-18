const _ = require('lodash');
const utils = require('../../qweb3.js/src/utils');

class OracleResultSet {
  constructor(blockNum, rawLog) {

    if (!_.isEmpty(rawLog)) {
      this.rawLog = rawLog;
      this.blockNum = blockNum;
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
