'use strict';

require('babel-polyfill');

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiAsPromised = require('chai-as-promised');

var _chaiAsPromised2 = _interopRequireDefault(_chaiAsPromised);

var _contract_utils = require('./util/contract_utils');

var _contract_utils2 = _interopRequireDefault(_contract_utils);

var _event_factory = require('./mock/event_factory');

var _event_factory2 = _interopRequireDefault(_event_factory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai2.default.use(_chaiAsPromised2.default);
var assert = _chai2.default.assert;

describe('EventFactory', function () {
  describe('createTopic()', function () {
    it('returns a tx receipt', function () {
      var res = _event_factory2.default.createTopic.result;
      assert.isTrue(_contract_utils2.default.isTxReceipt(res));
    });
  });
});