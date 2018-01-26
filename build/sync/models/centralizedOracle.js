'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* eslint no-underscore-dangle: 0 */

var _ = require('lodash');
var Decoder = require('qweb3').Decoder;

var CentralizedOracle = function () {
  function CentralizedOracle(blockNum, txid, rawLog) {
    _classCallCheck(this, CentralizedOracle);

    if (!_.isEmpty(rawLog)) {
      this.txid = txid;
      this.blockNum = blockNum;
      this.rawLog = rawLog;
      this.decode();
    }
  }

  _createClass(CentralizedOracle, [{
    key: 'decode',
    value: function decode() {
      this.version = this.rawLog._version.toNumber();
      this.contractAddress = this.rawLog._contractAddress;
      this.oracle = this.rawLog._oracle;
      this.eventAddress = this.rawLog._eventAddress;
      this.numOfResults = this.rawLog._numOfResults.toNumber();
      this.bettingStartBlock = this.rawLog._bettingStartBlock.toNumber();
      this.bettingEndBlock = this.rawLog._bettingEndBlock.toNumber();
      this.resultSettingStartBlock = this.rawLog._resultSettingStartBlock.toNumber();
      this.resultSettingEndBlock = this.rawLog._resultSettingEndBlock.toNumber();
      this.consensusThreshold = this.rawLog._consensusThreshold.toJSON();
    }
  }, {
    key: 'translate',
    value: function translate() {
      return {
        _id: this.contractAddress,
        version: this.version,
        address: this.contractAddress,
        txid: this.txid,
        topicAddress: this.eventAddress,
        resultSetterAddress: this.oracle,
        resultSetterQAddress: Decoder.toQtumAddress(this.oracle),
        status: 'VOTING',
        token: 'QTUM',
        name: this.name,
        options: this.options,
        optionIdxs: Array.from(Array(this.numOfResults).keys()),
        amounts: _.fill(Array(this.numOfResults), '0'),
        resultIdx: null,
        blockNum: this.blockNum,
        startBlock: this.bettingStartBlock,
        endBlock: this.bettingEndBlock,
        resultSetStartBlock: this.resultSettingStartBlock,
        resultSetEndBlock: this.resultSettingEndBlock,
        consensusThreshold: this.consensusThreshold
      };
    }
  }]);

  return CentralizedOracle;
}();

module.exports = CentralizedOracle;