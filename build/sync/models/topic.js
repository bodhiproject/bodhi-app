'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* eslint no-underscore-dangle: 0 */

var _ = require('lodash');
var Utils = require('qweb3').Utils;

var Topic = function () {
  function Topic(blockNum, txid, rawLog) {
    _classCallCheck(this, Topic);

    if (!_.isEmpty(rawLog)) {
      this.blockNum = blockNum;
      this.txid = txid;
      this.rawLog = rawLog;
      this.decode();
    }
  }

  _createClass(Topic, [{
    key: 'decode',
    value: function decode() {
      this.version = this.rawLog._version.toNumber();
      this.topicAddress = this.rawLog._topicAddress;

      var nameHex = _.reduce(this.rawLog._name, function (hexStr, value) {
        return hexStr.concat(value);
      }, '');
      this.name = Utils.toUtf8(nameHex);

      var intermedia = _.map(this.rawLog._resultNames, function (item) {
        return Utils.toUtf8(item);
      });
      this.resultNames = _.filter(intermedia, function (item) {
        return !!item;
      });
    }
  }, {
    key: 'translate',
    value: function translate() {
      return {
        _id: this.topicAddress,
        version: this.version,
        address: this.topicAddress,
        txid: this.txid,
        status: 'VOTING',
        name: this.name,
        options: this.resultNames,
        resultIdx: null,
        qtumAmount: _.fill(Array(this.resultNames.length), '0'),
        botAmount: _.fill(Array(this.resultNames.length), '0'),
        blockNum: this.blockNum
      };
    }
  }]);

  return Topic;
}();

module.exports = Topic;