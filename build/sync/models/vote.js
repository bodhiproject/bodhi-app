'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* eslint no-underscore-dangle: 0 */

var _ = require('lodash');
var Decoder = require('qweb3').Decoder;

var Vote = function () {
  function Vote(blockNum, txid, rawLog) {
    _classCallCheck(this, Vote);

    if (!_.isEmpty(rawLog)) {
      this.blockNum = blockNum;
      this.txid = txid;
      this.rawLog = rawLog;
      this.decode();
    }
  }

  _createClass(Vote, [{
    key: 'decode',
    value: function decode() {
      this.version = this.rawLog._version.toNumber();
      this.oracleAddress = this.rawLog._oracleAddress;
      this.participant = this.rawLog._participant;
      this.resultIndex = this.rawLog._resultIndex.toNumber();
      this.votedAmount = this.rawLog._votedAmount.toJSON();
    }
  }, {
    key: 'translate',
    value: function translate() {
      return {
        _id: this.txid,
        version: this.version,
        txid: this.txid,
        voterAddress: this.participant,
        voterQAddress: Decoder.toQtumAddress(this.participant),
        oracleAddress: this.oracleAddress,
        optionIdx: this.resultIndex,
        amount: this.votedAmount,
        blockNum: this.blockNum
      };
    }
  }]);

  return Vote;
}();

module.exports = Vote;