'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* eslint no-underscore-dangle: 0 */

var _ = require('lodash');

var FinalResultSet = function () {
  function FinalResultSet(rawLog) {
    _classCallCheck(this, FinalResultSet);

    if (!_.isEmpty(rawLog)) {
      this.rawLog = rawLog;
      this.decode();
    }
  }

  _createClass(FinalResultSet, [{
    key: 'decode',
    value: function decode() {
      this.version = this.rawLog._version.toNumber();
      this.eventAddress = this.rawLog._eventAddress;
      this.finalResultIndex = this.rawLog._finalResultIndex.toNumber();
    }
  }, {
    key: 'translate',
    value: function translate() {
      return {
        version: this.version,
        topicAddress: this.eventAddress,
        resultIdx: this.finalResultIndex
      };
    }
  }]);

  return FinalResultSet;
}();

module.exports = FinalResultSet;