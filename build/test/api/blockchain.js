'use strict';

require('babel-polyfill');

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiAsPromised = require('chai-as-promised');

var _chaiAsPromised2 = _interopRequireDefault(_chaiAsPromised);

var _blockchain = require('../../api/blockchain');

var _blockchain2 = _interopRequireDefault(_blockchain);

var _blockchain3 = require('./mock/blockchain');

var _blockchain4 = _interopRequireDefault(_blockchain3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

_chai2.default.use(_chaiAsPromised2.default);
var assert = _chai2.default.assert;
var expect = _chai2.default.expect;

describe('Blockchain', function () {
  describe('getBlockCount()', function () {
    it('returns the blockcount', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var res;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _blockchain2.default.getBlockCount();

            case 2:
              res = _context.sent;

              assert.isDefined(res);
              assert.isNumber(res);

            case 5:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    })));
  });

  describe('getTransactionReceipt()', function () {
    it('returns the transaction info', function () {
      var res = _blockchain4.default.getTransactionReceipt.result;

      assert.isDefined(res);
      assert.isDefined(res[0].blockHash);
      assert.isDefined(res[0].blockNumber);
      assert.isDefined(res[0].transactionHash);
      assert.isDefined(res[0].transactionIndex);
      assert.isDefined(res[0].from);
      assert.isDefined(res[0].to);
      assert.isDefined(res[0].cumulativeGasUsed);
      assert.isDefined(res[0].gasUsed);
      assert.isDefined(res[0].contractAddress);
      assert.isDefined(res[0].log);
      assert.isArray(res[0].log);
    });

    it('throws if transactionId is undefined or empty', function () {
      expect(_blockchain2.default.getTransactionReceipt()).to.be.rejectedWith(Error);
      expect(_blockchain2.default.getTransactionReceipt({ transactionId: undefined })).to.be.rejectedWith(Error);
      expect(_blockchain2.default.getTransactionReceipt({ transactionId: '' })).to.be.rejectedWith(Error);
    });
  });

  describe('searchLogs()', function () {
    it('returns an array of logs', function () {
      var res = _blockchain4.default.searchLogs.result;
      assert.isDefined(res);
      assert.isDefined(res[0].blockHash);
      assert.isDefined(res[0].blockNumber);
      assert.isDefined(res[0].transactionHash);
      assert.isDefined(res[0].transactionIndex);
      assert.isDefined(res[0].from);
      assert.isDefined(res[0].to);
      assert.isDefined(res[0].cumulativeGasUsed);
      assert.isDefined(res[0].gasUsed);
      assert.isDefined(res[0].contractAddress);
      assert.isDefined(res[0].log);
      assert.isArray(res[0].log);
    });

    it('throws if fromBlock is not a number', function () {
      expect(_blockchain2.default.searchLogs({
        fromBlock: 'a',
        toBlock: 50100,
        addresses: [],
        topics: ['c46e722c8158268af789d6a68206785f8d497869da236f87c2014c1c08fd3dec']
      })).to.be.rejectedWith(Error);
    });

    it('throws if toBlock is not a number', function () {
      expect(_blockchain2.default.searchLogs({
        fromBlock: 50000,
        toBlock: 'a',
        addresses: [],
        topics: ['c46e722c8158268af789d6a68206785f8d497869da236f87c2014c1c08fd3dec']
      })).to.be.rejectedWith(Error);
    });
  });
});