'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* eslint no-underscore-dangle: 0 */

var _ = require('lodash');

var DecentralizedOracle = function () {
  function DecentralizedOracle(blockNum, txid, rawLog) {
    _classCallCheck(this, DecentralizedOracle);

    if (!_.isEmpty(rawLog)) {
      this.blockNum = blockNum;
      this.txid = txid;
      this.rawLog = rawLog;
      this.decode();
    }
  }

  _createClass(DecentralizedOracle, [{
    key: 'decode',
    value: function decode() {
      this.version = this.rawLog._version.toNumber();
      this.contractAddress = this.rawLog._contractAddress;
      this.eventAddress = this.rawLog._eventAddress;
      this.numOfResults = this.rawLog._numOfResults.toNumber();
      this.lastResultIndex = this.rawLog._lastResultIndex.toNumber();
      this.arbitrationEndTime = this.rawLog._arbitrationEndTime.toNumber();
      this.consensusThreshold = this.rawLog._consensusThreshold.toJSON();
    }
  }, {
    key: 'translate',
    value: function translate() {
      var _this = this;

      var optionIdxs = Array.from(Array(this.numOfResults).keys());
      _.remove(optionIdxs, function (num) {
        return num === _this.lastResultIndex;
      });

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
        optionIdxs: optionIdxs,
        amounts: _.fill(Array(this.numOfResults), '0'),
        resultIdx: null,
        blockNum: this.blockNum,
        startTime: this.blockNum,
        endTime: this.arbitrationEndTime,
        consensusThreshold: this.consensusThreshold
      };
    }
  }]);

  return DecentralizedOracle;
}();

module.exports = DecentralizedOracle;