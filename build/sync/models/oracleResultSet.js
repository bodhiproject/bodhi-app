'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* eslint no-underscore-dangle: 0 */

var _ = require('lodash');

var OracleResultSet = function () {
  function OracleResultSet(rawLog) {
    _classCallCheck(this, OracleResultSet);

    if (!_.isEmpty(rawLog)) {
      this.rawLog = rawLog;
      this.decode();
    }
  }

  _createClass(OracleResultSet, [{
    key: 'decode',
    value: function decode() {
      this.version = this.rawLog._version.toNumber();
      this.oracleAddress = this.rawLog._oracleAddress;
      this.resultIndex = this.rawLog._resultIndex.toNumber();
    }
  }, {
    key: 'translate',
    value: function translate() {
      return {
        version: this.version,
        oracleAddress: this.oracleAddress,
        resultIdx: this.resultIndex
      };
    }
  }]);

  return OracleResultSet;
}();

module.exports = OracleResultSet;