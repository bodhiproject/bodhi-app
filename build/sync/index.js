'use strict';

var sync = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(db) {
    var _this = this;

    var removeHexPrefix, topicsNeedBalanceUpdate, oraclesNeedBalanceUpdate, currentBlockChainHeight, currentBlockHash, currentBlockTime, startBlock, blocks;
    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            removeHexPrefix = true;
            topicsNeedBalanceUpdate = new Set();
            oraclesNeedBalanceUpdate = new Set();
            _context10.next = 5;
            return qclient.getBlockCount();

          case 5:
            currentBlockChainHeight = _context10.sent;

            currentBlockChainHeight -= 1;

            _context10.next = 9;
            return qclient.getBlockHash(currentBlockChainHeight);

          case 9:
            currentBlockHash = _context10.sent;
            _context10.next = 12;
            return qclient.getBlock(currentBlockHash);

          case 12:
            currentBlockTime = _context10.sent.time;
            startBlock = contractDeployedBlockNum;
            _context10.next = 16;
            return db.Blocks.cfind({}).sort({ blockNum: -1 }).limit(1).exec();

          case 16:
            blocks = _context10.sent;

            if (blocks.length > 0) {
              startBlock = Math.max(blocks[0].blockNum + 1, startBlock);
            }

            sequentialLoop(Math.ceil((currentBlockChainHeight - startBlock) / batchSize), function () {
              var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(loop) {
                var endBlock, updateBlockPromises, _loop, i;

                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        endBlock = Math.min(startBlock + batchSize - 1, currentBlockChainHeight);
                        _context3.next = 3;
                        return syncTopicCreated(db, startBlock, endBlock, removeHexPrefix);

                      case 3:
                        console.log('Synced Topics\n');

                        _context3.next = 6;
                        return Promise.all([syncCentralizedOracleCreated(db, startBlock, endBlock, removeHexPrefix), syncDecentralizedOracleCreated(db, startBlock, endBlock, removeHexPrefix, currentBlockTime), syncOracleResultVoted(db, startBlock, endBlock, removeHexPrefix, oraclesNeedBalanceUpdate)]);

                      case 6:
                        console.log('Synced Oracles\n');

                        _context3.next = 9;
                        return Promise.all([syncOracleResultSet(db, startBlock, endBlock, removeHexPrefix, oraclesNeedBalanceUpdate), syncFinalResultSet(db, startBlock, endBlock, removeHexPrefix, topicsNeedBalanceUpdate)]);

                      case 9:
                        console.log('Synced Result Set\n');

                        updateBlockPromises = [];

                        _loop = function _loop(i) {
                          var updateBlockPromise = new Promise(function () {
                            var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(resolve) {
                              return regeneratorRuntime.wrap(function _callee2$(_context2) {
                                while (1) {
                                  switch (_context2.prev = _context2.next) {
                                    case 0:
                                      _context2.next = 2;
                                      return db.Blocks.insert({ _id: i, blockNum: i, blockTime: currentBlockTime });

                                    case 2:
                                      resolve();

                                    case 3:
                                    case 'end':
                                      return _context2.stop();
                                  }
                                }
                              }, _callee2, _this);
                            }));

                            return function (_x3) {
                              return _ref4.apply(this, arguments);
                            };
                          }());
                          updateBlockPromises.push(updateBlockPromise);
                        };

                        for (i = startBlock; i <= endBlock; i++) {
                          _loop(i);
                        }
                        _context3.next = 15;
                        return Promise.all(updateBlockPromises);

                      case 15:
                        console.log('Inserted Blocks\n');

                        startBlock = endBlock + 1;
                        loop.next();

                      case 18:
                      case 'end':
                        return _context3.stop();
                    }
                  }
                }, _callee3, _this);
              }));

              return function (_x2) {
                return _ref3.apply(this, arguments);
              };
            }(), _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
              var oracleAddressBatches;
              return regeneratorRuntime.wrap(function _callee9$(_context9) {
                while (1) {
                  switch (_context9.prev = _context9.next) {
                    case 0:
                      oracleAddressBatches = _.chunk(Array.from(oraclesNeedBalanceUpdate), RPC_BATCH_SIZE);
                      // execute rpc batch by batch

                      sequentialLoop(oracleAddressBatches.length, function () {
                        var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(loop) {
                          var oracleIteration, topicAddressBatches;
                          return regeneratorRuntime.wrap(function _callee7$(_context7) {
                            while (1) {
                              switch (_context7.prev = _context7.next) {
                                case 0:
                                  oracleIteration = loop.iteration();

                                  console.log('oracle batch: ' + oracleIteration);
                                  _context7.next = 4;
                                  return Promise.all(oracleAddressBatches[oracleIteration].map(function () {
                                    var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(oracleAddress) {
                                      return regeneratorRuntime.wrap(function _callee4$(_context4) {
                                        while (1) {
                                          switch (_context4.prev = _context4.next) {
                                            case 0:
                                              _context4.next = 2;
                                              return updateOracleBalance(oracleAddress, topicsNeedBalanceUpdate, db);

                                            case 2:
                                            case 'end':
                                              return _context4.stop();
                                          }
                                        }
                                      }, _callee4, _this);
                                    }));

                                    return function (_x5) {
                                      return _ref7.apply(this, arguments);
                                    };
                                  }()));

                                case 4:

                                  // Oracle balance update completed
                                  if (oracleIteration === oracleAddressBatches.length - 1) {
                                    // two rpc call per topic balance so batch_size = RPC_BATCH_SIZE/2
                                    topicAddressBatches = _.chunk(Array.from(topicsNeedBalanceUpdate), Math.floor(RPC_BATCH_SIZE / 2));

                                    sequentialLoop(topicAddressBatches.length, function () {
                                      var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(topicLoop) {
                                        var topicIteration;
                                        return regeneratorRuntime.wrap(function _callee6$(_context6) {
                                          while (1) {
                                            switch (_context6.prev = _context6.next) {
                                              case 0:
                                                topicIteration = topicLoop.iteration();

                                                console.log('topic batch: ' + topicIteration);
                                                _context6.next = 4;
                                                return Promise.all(topicAddressBatches[topicIteration].map(function () {
                                                  var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(topicAddress) {
                                                    return regeneratorRuntime.wrap(function _callee5$(_context5) {
                                                      while (1) {
                                                        switch (_context5.prev = _context5.next) {
                                                          case 0:
                                                            _context5.next = 2;
                                                            return updateTopicBalance(topicAddress, db);

                                                          case 2:
                                                          case 'end':
                                                            return _context5.stop();
                                                        }
                                                      }
                                                    }, _callee5, _this);
                                                  }));

                                                  return function (_x7) {
                                                    return _ref9.apply(this, arguments);
                                                  };
                                                }()));

                                              case 4:
                                                console.log('next topic batch');
                                                topicLoop.next();

                                              case 6:
                                              case 'end':
                                                return _context6.stop();
                                            }
                                          }
                                        }, _callee6, _this);
                                      }));

                                      return function (_x6) {
                                        return _ref8.apply(this, arguments);
                                      };
                                    }(), function () {
                                      console.log('Updated topics balance');
                                      loop.next();
                                    });
                                  } else {
                                    console.log('next oracle batch');
                                    loop.next();
                                  }

                                case 5:
                                case 'end':
                                  return _context7.stop();
                              }
                            }
                          }, _callee7, _this);
                        }));

                        return function (_x4) {
                          return _ref6.apply(this, arguments);
                        };
                      }(), _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
                        return regeneratorRuntime.wrap(function _callee8$(_context8) {
                          while (1) {
                            switch (_context8.prev = _context8.next) {
                              case 0:
                                _context8.next = 2;
                                return updateOraclesPassedEndTime(currentBlockTime, db);

                              case 2:
                                _context8.next = 4;
                                return updateCentralizedOraclesPassedResultSetEndTime(currentBlockTime, db);

                              case 4:

                                // nedb doesnt require close db, leave the comment as a reminder
                                // await db.Connection.close();
                                console.log('sleep');
                                setTimeout(startSync, 5000);

                              case 6:
                              case 'end':
                                return _context8.stop();
                            }
                          }
                        }, _callee8, _this);
                      })));

                    case 2:
                    case 'end':
                      return _context9.stop();
                  }
                }
              }, _callee9, _this);
            })));

          case 19:
          case 'end':
            return _context10.stop();
        }
      }
    }, _callee10, this);
  }));

  return function sync(_x) {
    return _ref2.apply(this, arguments);
  };
}();

var fetchNameOptionsFromTopic = function () {
  var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(db, address) {
    var topic;
    return regeneratorRuntime.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _context11.next = 2;
            return db.Topics.findOne({ _id: address }, { name: 1, options: 1 });

          case 2:
            topic = _context11.sent;

            if (topic) {
              _context11.next = 7;
              break;
            }

            throw Error('could not find Topic ' + address + ' in db');

          case 7:
            return _context11.abrupt('return', topic);

          case 8:
          case 'end':
            return _context11.stop();
        }
      }
    }, _callee11, this);
  }));

  return function fetchNameOptionsFromTopic(_x8, _x9) {
    return _ref11.apply(this, arguments);
  };
}();

var syncTopicCreated = function () {
  var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(db, startBlock, endBlock, removeHexPrefix) {
    var _this2 = this;

    var result, createTopicPromises;
    return regeneratorRuntime.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            result = void 0;
            _context13.prev = 1;
            _context13.next = 4;
            return qclient.searchLogs(startBlock, endBlock, Contracts.EventFactory.address, [Contracts.EventFactory.TopicCreated], Contracts, removeHexPrefix);

          case 4:
            result = _context13.sent;

            console.log('searchlog TopicCreated');
            _context13.next = 12;
            break;

          case 8:
            _context13.prev = 8;
            _context13.t0 = _context13['catch'](1);

            console.error('ERROR: ' + _context13.t0.message);
            return _context13.abrupt('return');

          case 12:

            console.log(startBlock + ' - ' + endBlock + ': Retrieved ' + result.length + ' entries from TopicCreated');
            createTopicPromises = [];


            _.forEach(result, function (event, index) {
              var blockNum = event.blockNumber;
              var txid = event.transactionHash;
              _.forEachRight(event.log, function (rawLog) {
                if (rawLog._eventName === 'TopicCreated') {
                  var insertTopicDB = new Promise(function () {
                    var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(resolve) {
                      var topic;
                      return regeneratorRuntime.wrap(function _callee12$(_context12) {
                        while (1) {
                          switch (_context12.prev = _context12.next) {
                            case 0:
                              _context12.prev = 0;
                              topic = new Topic(blockNum, txid, rawLog).translate();
                              _context12.next = 4;
                              return db.Topics.insert(topic);

                            case 4:
                              resolve();
                              _context12.next = 11;
                              break;

                            case 7:
                              _context12.prev = 7;
                              _context12.t0 = _context12['catch'](0);

                              console.error('ERROR: ' + _context12.t0.message);
                              resolve();

                            case 11:
                            case 'end':
                              return _context12.stop();
                          }
                        }
                      }, _callee12, _this2, [[0, 7]]);
                    }));

                    return function (_x14) {
                      return _ref13.apply(this, arguments);
                    };
                  }());

                  createTopicPromises.push(insertTopicDB);
                }
              });
            });

            _context13.next = 17;
            return Promise.all(createTopicPromises);

          case 17:
          case 'end':
            return _context13.stop();
        }
      }
    }, _callee13, this, [[1, 8]]);
  }));

  return function syncTopicCreated(_x10, _x11, _x12, _x13) {
    return _ref12.apply(this, arguments);
  };
}();

var syncCentralizedOracleCreated = function () {
  var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(db, startBlock, endBlock, removeHexPrefix) {
    var _this3 = this;

    var result, createCentralizedOraclePromises;
    return regeneratorRuntime.wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            result = void 0;
            _context15.prev = 1;
            _context15.next = 4;
            return qclient.searchLogs(startBlock, endBlock, Contracts.EventFactory.address, [Contracts.OracleFactory.CentralizedOracleCreated], Contracts, removeHexPrefix);

          case 4:
            result = _context15.sent;

            console.log('searchlog CentralizedOracleCreated');
            _context15.next = 12;
            break;

          case 8:
            _context15.prev = 8;
            _context15.t0 = _context15['catch'](1);

            console.error('ERROR: ' + _context15.t0.message);
            return _context15.abrupt('return');

          case 12:

            console.log(startBlock + ' - ' + endBlock + ': Retrieved ' + result.length + ' entries from CentralizedOracleCreated');
            createCentralizedOraclePromises = [];


            _.forEach(result, function (event, index) {
              var blockNum = event.blockNumber;
              var txid = event.transactionHash;
              _.forEachRight(event.log, function (rawLog) {
                if (rawLog._eventName === 'CentralizedOracleCreated') {
                  var insertOracleDB = new Promise(function () {
                    var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(resolve) {
                      var centralOracle, topic;
                      return regeneratorRuntime.wrap(function _callee14$(_context14) {
                        while (1) {
                          switch (_context14.prev = _context14.next) {
                            case 0:
                              _context14.prev = 0;
                              centralOracle = new CentralizedOracle(blockNum, txid, rawLog).translate();
                              _context14.next = 4;
                              return fetchNameOptionsFromTopic(db, centralOracle.topicAddress);

                            case 4:
                              topic = _context14.sent;


                              centralOracle.name = topic.name;
                              centralOracle.options = topic.options;

                              _context14.next = 9;
                              return db.Oracles.insert(centralOracle);

                            case 9:
                              resolve();
                              _context14.next = 16;
                              break;

                            case 12:
                              _context14.prev = 12;
                              _context14.t0 = _context14['catch'](0);

                              console.error('ERROR: ' + _context14.t0.message);
                              resolve();

                            case 16:
                            case 'end':
                              return _context14.stop();
                          }
                        }
                      }, _callee14, _this3, [[0, 12]]);
                    }));

                    return function (_x19) {
                      return _ref15.apply(this, arguments);
                    };
                  }());

                  createCentralizedOraclePromises.push(insertOracleDB);
                }
              });
            });

            _context15.next = 17;
            return Promise.all(createCentralizedOraclePromises);

          case 17:
          case 'end':
            return _context15.stop();
        }
      }
    }, _callee15, this, [[1, 8]]);
  }));

  return function syncCentralizedOracleCreated(_x15, _x16, _x17, _x18) {
    return _ref14.apply(this, arguments);
  };
}();

var syncDecentralizedOracleCreated = function () {
  var _ref16 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17(db, startBlock, endBlock, removeHexPrefix, currentBlockTime) {
    var _this4 = this;

    var result, createDecentralizedOraclePromises;
    return regeneratorRuntime.wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            result = void 0;
            _context17.prev = 1;
            _context17.next = 4;
            return qclient.searchLogs(startBlock, endBlock, [], Contracts.OracleFactory.DecentralizedOracleCreated, Contracts, removeHexPrefix);

          case 4:
            result = _context17.sent;

            console.log('searchlog DecentralizedOracleCreated');
            _context17.next = 12;
            break;

          case 8:
            _context17.prev = 8;
            _context17.t0 = _context17['catch'](1);

            console.error('ERROR: ' + _context17.t0.message);
            return _context17.abrupt('return');

          case 12:

            console.log(startBlock + ' - ' + endBlock + ': Retrieved ' + result.length + ' entries from DecentralizedOracleCreated');
            createDecentralizedOraclePromises = [];


            _.forEach(result, function (event, index) {
              var blockNum = event.blockNumber;
              var txid = event.transactionHash;
              _.forEachRight(event.log, function (rawLog) {
                if (rawLog._eventName === 'DecentralizedOracleCreated') {
                  var insertOracleDB = new Promise(function () {
                    var _ref17 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16(resolve) {
                      var decentralOracle, topic;
                      return regeneratorRuntime.wrap(function _callee16$(_context16) {
                        while (1) {
                          switch (_context16.prev = _context16.next) {
                            case 0:
                              _context16.prev = 0;
                              decentralOracle = new DecentralizedOracle(blockNum, txid, rawLog).translate();
                              _context16.next = 4;
                              return fetchNameOptionsFromTopic(db, decentralOracle.topicAddress);

                            case 4:
                              topic = _context16.sent;


                              decentralOracle.name = topic.name;
                              decentralOracle.options = topic.options;
                              decentralOracle.startTime = currentBlockTime;

                              _context16.next = 10;
                              return db.Oracles.insert(decentralOracle);

                            case 10:
                              resolve();
                              _context16.next = 17;
                              break;

                            case 13:
                              _context16.prev = 13;
                              _context16.t0 = _context16['catch'](0);

                              console.error('ERROR: ' + _context16.t0.message);
                              resolve();

                            case 17:
                            case 'end':
                              return _context16.stop();
                          }
                        }
                      }, _callee16, _this4, [[0, 13]]);
                    }));

                    return function (_x25) {
                      return _ref17.apply(this, arguments);
                    };
                  }());
                  createDecentralizedOraclePromises.push(insertOracleDB);
                }
              });
            });

            _context17.next = 17;
            return Promise.all(createDecentralizedOraclePromises);

          case 17:
          case 'end':
            return _context17.stop();
        }
      }
    }, _callee17, this, [[1, 8]]);
  }));

  return function syncDecentralizedOracleCreated(_x20, _x21, _x22, _x23, _x24) {
    return _ref16.apply(this, arguments);
  };
}();

var syncOracleResultVoted = function () {
  var _ref18 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee19(db, startBlock, endBlock, removeHexPrefix, oraclesNeedBalanceUpdate) {
    var _this5 = this;

    var result, createOracleResultVotedPromises;
    return regeneratorRuntime.wrap(function _callee19$(_context19) {
      while (1) {
        switch (_context19.prev = _context19.next) {
          case 0:
            result = void 0;
            _context19.prev = 1;
            _context19.next = 4;
            return qclient.searchLogs(startBlock, endBlock, [], Contracts.CentralizedOracle.OracleResultVoted, Contracts, removeHexPrefix);

          case 4:
            result = _context19.sent;

            console.log('searchlog OracleResultVoted');
            _context19.next = 12;
            break;

          case 8:
            _context19.prev = 8;
            _context19.t0 = _context19['catch'](1);

            console.error('ERROR: ' + _context19.t0.message);
            return _context19.abrupt('return');

          case 12:

            console.log(startBlock + ' - ' + endBlock + ': Retrieved ' + result.length + ' entries from OracleResultVoted');
            createOracleResultVotedPromises = [];


            _.forEach(result, function (event, index) {
              var blockNum = event.blockNumber;
              var txid = event.transactionHash;
              _.forEachRight(event.log, function (rawLog) {
                if (rawLog._eventName === 'OracleResultVoted') {
                  var insertVoteDB = new Promise(function () {
                    var _ref19 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee18(resolve) {
                      var vote;
                      return regeneratorRuntime.wrap(function _callee18$(_context18) {
                        while (1) {
                          switch (_context18.prev = _context18.next) {
                            case 0:
                              _context18.prev = 0;
                              vote = new Vote(blockNum, txid, rawLog).translate();

                              oraclesNeedBalanceUpdate.add(vote.oracleAddress);

                              _context18.next = 5;
                              return db.Votes.insert(vote);

                            case 5:
                              resolve();
                              _context18.next = 12;
                              break;

                            case 8:
                              _context18.prev = 8;
                              _context18.t0 = _context18['catch'](0);

                              console.error('ERROR: ' + _context18.t0.message);
                              resolve();

                            case 12:
                            case 'end':
                              return _context18.stop();
                          }
                        }
                      }, _callee18, _this5, [[0, 8]]);
                    }));

                    return function (_x31) {
                      return _ref19.apply(this, arguments);
                    };
                  }());

                  createOracleResultVotedPromises.push(insertVoteDB);
                }
              });
            });

            _context19.next = 17;
            return Promise.all(createOracleResultVotedPromises);

          case 17:
          case 'end':
            return _context19.stop();
        }
      }
    }, _callee19, this, [[1, 8]]);
  }));

  return function syncOracleResultVoted(_x26, _x27, _x28, _x29, _x30) {
    return _ref18.apply(this, arguments);
  };
}();

var syncOracleResultSet = function () {
  var _ref20 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee21(db, startBlock, endBlock, removeHexPrefix, oraclesNeedBalanceUpdate) {
    var _this6 = this;

    var result, updateOracleResultSetPromises;
    return regeneratorRuntime.wrap(function _callee21$(_context21) {
      while (1) {
        switch (_context21.prev = _context21.next) {
          case 0:
            result = void 0;
            _context21.prev = 1;
            _context21.next = 4;
            return qclient.searchLogs(startBlock, endBlock, [], Contracts.CentralizedOracle.OracleResultSet, Contracts, removeHexPrefix);

          case 4:
            result = _context21.sent;

            console.log('searchlog OracleResultSet');
            _context21.next = 12;
            break;

          case 8:
            _context21.prev = 8;
            _context21.t0 = _context21['catch'](1);

            console.error('ERROR: ' + _context21.t0.message);
            return _context21.abrupt('return');

          case 12:

            console.log(startBlock + ' - ' + endBlock + ': Retrieved ' + result.length + ' entries from OracleResultSet');
            updateOracleResultSetPromises = [];


            _.forEach(result, function (event, index) {
              _.forEachRight(event.log, function (rawLog) {
                if (rawLog._eventName === 'OracleResultSet') {
                  var updateOracleResult = new Promise(function () {
                    var _ref21 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee20(resolve) {
                      var oracleResult;
                      return regeneratorRuntime.wrap(function _callee20$(_context20) {
                        while (1) {
                          switch (_context20.prev = _context20.next) {
                            case 0:
                              _context20.prev = 0;
                              oracleResult = new OracleResultSet(rawLog).translate();
                              // safeguard to update balance, can be removed in the future

                              oraclesNeedBalanceUpdate.add(oracleResult.oracleAddress);

                              _context20.next = 5;
                              return db.Oracles.update({ _id: oracleResult.oracleAddress }, { $set: { resultIdx: oracleResult.resultIdx, status: 'PENDING' } }, {});

                            case 5:
                              resolve();
                              _context20.next = 12;
                              break;

                            case 8:
                              _context20.prev = 8;
                              _context20.t0 = _context20['catch'](0);

                              console.error('ERROR: ' + _context20.t0.message);
                              resolve();

                            case 12:
                            case 'end':
                              return _context20.stop();
                          }
                        }
                      }, _callee20, _this6, [[0, 8]]);
                    }));

                    return function (_x37) {
                      return _ref21.apply(this, arguments);
                    };
                  }());

                  updateOracleResultSetPromises.push(updateOracleResult);
                }
              });
            });

            _context21.next = 17;
            return Promise.all(updateOracleResultSetPromises);

          case 17:
          case 'end':
            return _context21.stop();
        }
      }
    }, _callee21, this, [[1, 8]]);
  }));

  return function syncOracleResultSet(_x32, _x33, _x34, _x35, _x36) {
    return _ref20.apply(this, arguments);
  };
}();

var syncFinalResultSet = function () {
  var _ref22 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee23(db, startBlock, endBlock, removeHexPrefix, topicsNeedBalanceUpdate) {
    var _this7 = this;

    var result, updateFinalResultSetPromises;
    return regeneratorRuntime.wrap(function _callee23$(_context23) {
      while (1) {
        switch (_context23.prev = _context23.next) {
          case 0:
            result = void 0;
            _context23.prev = 1;
            _context23.next = 4;
            return qclient.searchLogs(startBlock, endBlock, [], Contracts.TopicEvent.FinalResultSet, Contracts, removeHexPrefix);

          case 4:
            result = _context23.sent;

            console.log('searchlog FinalResultSet');
            _context23.next = 12;
            break;

          case 8:
            _context23.prev = 8;
            _context23.t0 = _context23['catch'](1);

            console.error('ERROR: ' + _context23.t0.message);
            return _context23.abrupt('return');

          case 12:

            console.log(startBlock + ' - ' + endBlock + ': Retrieved ' + result.length + ' entries from FinalResultSet');
            updateFinalResultSetPromises = [];


            _.forEach(result, function (event, index) {
              _.forEachRight(event.log, function (rawLog) {
                if (rawLog._eventName === 'FinalResultSet') {
                  var updateFinalResultSet = new Promise(function () {
                    var _ref23 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee22(resolve) {
                      var topicResult;
                      return regeneratorRuntime.wrap(function _callee22$(_context22) {
                        while (1) {
                          switch (_context22.prev = _context22.next) {
                            case 0:
                              _context22.prev = 0;
                              topicResult = new FinalResultSet(rawLog).translate();
                              // safeguard to update balance, can be removed in the future

                              topicsNeedBalanceUpdate.add(topicResult.topicAddress);

                              _context22.next = 5;
                              return db.Topics.update({ _id: topicResult.topicAddress }, { $set: { resultIdx: topicResult.resultIdx, status: 'WITHDRAW' } });

                            case 5:
                              _context22.next = 7;
                              return db.Oracles.update({ topicAddress: topicResult.topicAddress }, { $set: { resultIdx: topicResult.resultIdx, status: 'WITHDRAW' } }, { multi: true });

                            case 7:
                              resolve();
                              _context22.next = 14;
                              break;

                            case 10:
                              _context22.prev = 10;
                              _context22.t0 = _context22['catch'](0);

                              console.error('ERROR: ' + _context22.t0.message);
                              resolve();

                            case 14:
                            case 'end':
                              return _context22.stop();
                          }
                        }
                      }, _callee22, _this7, [[0, 10]]);
                    }));

                    return function (_x43) {
                      return _ref23.apply(this, arguments);
                    };
                  }());

                  updateFinalResultSetPromises.push(updateFinalResultSet);
                }
              });
            });

            _context23.next = 17;
            return Promise.all(updateFinalResultSetPromises);

          case 17:
          case 'end':
            return _context23.stop();
        }
      }
    }, _callee23, this, [[1, 8]]);
  }));

  return function syncFinalResultSet(_x38, _x39, _x40, _x41, _x42) {
    return _ref22.apply(this, arguments);
  };
}();

// all central & decentral oracles with VOTING status and endTime less than currentBlockTime


var updateOraclesPassedEndTime = function () {
  var _ref24 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee24(currentBlockTime, db) {
    return regeneratorRuntime.wrap(function _callee24$(_context24) {
      while (1) {
        switch (_context24.prev = _context24.next) {
          case 0:
            _context24.prev = 0;
            _context24.next = 3;
            return db.Oracles.update({ endTime: { $lt: currentBlockTime }, status: 'VOTING' }, { $set: { status: 'WAITRESULT' } }, { multi: true });

          case 3:
            console.log('Updated Oracles passed endTime');
            _context24.next = 9;
            break;

          case 6:
            _context24.prev = 6;
            _context24.t0 = _context24['catch'](0);

            console.error('ERROR: updateOraclesPassedEndTime ' + _context24.t0.message);

          case 9:
          case 'end':
            return _context24.stop();
        }
      }
    }, _callee24, this, [[0, 6]]);
  }));

  return function updateOraclesPassedEndTime(_x44, _x45) {
    return _ref24.apply(this, arguments);
  };
}();

// central oracles with WAITRESULT status and resultSetEndTime less than currentBlockTime


var updateCentralizedOraclesPassedResultSetEndTime = function () {
  var _ref25 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee25(currentBlockTime, db) {
    return regeneratorRuntime.wrap(function _callee25$(_context25) {
      while (1) {
        switch (_context25.prev = _context25.next) {
          case 0:
            _context25.prev = 0;
            _context25.next = 3;
            return db.Oracles.update({ resultSetEndTime: { $lt: currentBlockTime }, token: 'QTUM', status: 'WAITRESULT' }, { $set: { status: 'OPENRESULTSET' } }, { multi: true });

          case 3:
            console.log('Updated COracles passed resultSetEndTime');
            _context25.next = 9;
            break;

          case 6:
            _context25.prev = 6;
            _context25.t0 = _context25['catch'](0);

            console.error('ERROR: updateCentralizedOraclesPassedResultSetEndTime ' + _context25.t0.message);

          case 9:
          case 'end':
            return _context25.stop();
        }
      }
    }, _callee25, this, [[0, 6]]);
  }));

  return function updateCentralizedOraclesPassedResultSetEndTime(_x46, _x47) {
    return _ref25.apply(this, arguments);
  };
}();

var updateOracleBalance = function () {
  var _ref26 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee26(oracleAddress, topicSet, db) {
    var oracle, value, contract, _contract, balances;

    return regeneratorRuntime.wrap(function _callee26$(_context26) {
      while (1) {
        switch (_context26.prev = _context26.next) {
          case 0:
            oracle = void 0;
            _context26.prev = 1;
            _context26.next = 4;
            return db.Oracles.findOne({ _id: oracleAddress });

          case 4:
            oracle = _context26.sent;

            if (oracle) {
              _context26.next = 8;
              break;
            }

            console.error('ERROR: find 0 oracle ' + oracleAddress + ' in db to update');
            return _context26.abrupt('return');

          case 8:
            _context26.next = 14;
            break;

          case 10:
            _context26.prev = 10;
            _context26.t0 = _context26['catch'](1);

            console.error('ERROR: update oracle ' + oracleAddress + ' in db, ' + _context26.t0.message);
            return _context26.abrupt('return');

          case 14:

            // related topic should be updated
            topicSet.add(oracle.topicAddress);
            value = void 0;

            if (!(oracle.token === 'QTUM')) {
              _context26.next = 30;
              break;
            }

            // centrailized
            contract = new Contract(config.QTUM_RPC_ADDRESS, oracleAddress, Contracts.CentralizedOracle.abi);
            _context26.prev = 18;
            _context26.next = 21;
            return contract.call('getTotalBets', { methodArgs: [], senderAddress: senderAddress });

          case 21:
            value = _context26.sent;
            _context26.next = 28;
            break;

          case 24:
            _context26.prev = 24;
            _context26.t1 = _context26['catch'](18);

            console.error('ERROR: getTotalBets for oracle ' + oracleAddress + ', ' + _context26.t1.message);
            return _context26.abrupt('return');

          case 28:
            _context26.next = 41;
            break;

          case 30:
            // decentralized
            _contract = new Contract(config.QTUM_RPC_ADDRESS, oracleAddress, Contracts.DecentralizedOracle.abi);
            _context26.prev = 31;
            _context26.next = 34;
            return _contract.call('getTotalVotes', { methodArgs: [], senderAddress: senderAddress });

          case 34:
            value = _context26.sent;
            _context26.next = 41;
            break;

          case 37:
            _context26.prev = 37;
            _context26.t2 = _context26['catch'](31);

            console.error('ERROR: getTotalVotes for oracle ' + oracleAddress + ', ' + _context26.t2.message);
            return _context26.abrupt('return');

          case 41:
            balances = _.map(value[0].slice(0, oracle.numOfResults), function (balanceBN) {
              return balanceBN.toJSON();
            });
            _context26.prev = 42;
            _context26.next = 45;
            return db.Oracles.update({ _id: oracleAddress }, { $set: { amounts: balances } });

          case 45:
            console.log('Update oracle ' + oracleAddress + ' amounts ' + balances);
            _context26.next = 51;
            break;

          case 48:
            _context26.prev = 48;
            _context26.t3 = _context26['catch'](42);

            console.error('ERROR: update oracle ' + oracleAddress + ', ' + _context26.t3.message);

          case 51:
          case 'end':
            return _context26.stop();
        }
      }
    }, _callee26, this, [[1, 10], [18, 24], [31, 37], [42, 48]]);
  }));

  return function updateOracleBalance(_x48, _x49, _x50) {
    return _ref26.apply(this, arguments);
  };
}();

var updateTopicBalance = function () {
  var _ref27 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee27(topicAddress, db) {
    var topic, contract, totalBetsValue, totalVotesValue, getTotalBetsPromise, getTotalVotesPromise, totalBetsBalances, totalVotesBalances;
    return regeneratorRuntime.wrap(function _callee27$(_context27) {
      while (1) {
        switch (_context27.prev = _context27.next) {
          case 0:
            topic = void 0;
            _context27.prev = 1;
            _context27.next = 4;
            return db.Topics.findOne({ _id: topicAddress });

          case 4:
            topic = _context27.sent;

            if (topic) {
              _context27.next = 8;
              break;
            }

            console.error('ERROR: find 0 topic ' + topicAddress + ' in db to update');
            return _context27.abrupt('return');

          case 8:
            _context27.next = 14;
            break;

          case 10:
            _context27.prev = 10;
            _context27.t0 = _context27['catch'](1);

            console.error('ERROR: find topic ' + topicAddress + ' in db, ' + _context27.t0.message);
            return _context27.abrupt('return');

          case 14:
            contract = new Contract(config.QTUM_RPC_ADDRESS, topicAddress, Contracts.TopicEvent.abi);
            totalBetsValue = void 0;
            totalVotesValue = void 0;
            _context27.prev = 17;
            getTotalBetsPromise = contract.call('getTotalBets', { methodArgs: [], senderAddress: senderAddress });
            getTotalVotesPromise = contract.call('getTotalVotes', { methodArgs: [], senderAddress: senderAddress });
            _context27.next = 22;
            return getTotalBetsPromise;

          case 22:
            totalBetsValue = _context27.sent;
            _context27.next = 25;
            return getTotalVotesPromise;

          case 25:
            totalVotesValue = _context27.sent;
            _context27.next = 32;
            break;

          case 28:
            _context27.prev = 28;
            _context27.t1 = _context27['catch'](17);

            console.error('ERROR: getTotalBets for topic ' + topicAddress + ', ' + _context27.t1.message);
            return _context27.abrupt('return');

          case 32:
            totalBetsBalances = _.map(totalBetsValue[0].slice(0, topic.options.length), function (balanceBN) {
              return balanceBN.toJSON();
            });
            totalVotesBalances = _.map(totalVotesValue[0].slice(0, topic.options.length), function (balanceBN) {
              return balanceBN.toJSON();
            });
            _context27.prev = 34;
            _context27.next = 37;
            return db.Topics.update({ _id: topicAddress }, { $set: { qtumAmount: totalBetsBalances, botAmount: totalVotesBalances } });

          case 37:
            console.log('Update topic ' + topicAddress + ' qtumAmount ' + totalBetsBalances + ' botAmount ' + totalVotesBalances);
            _context27.next = 43;
            break;

          case 40:
            _context27.prev = 40;
            _context27.t2 = _context27['catch'](34);

            console.error('ERROR: update topic ' + topicAddress + ' in db, ' + _context27.t2.message);

          case 43:
          case 'end':
            return _context27.stop();
        }
      }
    }, _callee27, this, [[1, 10], [17, 28], [34, 40]]);
  }));

  return function updateTopicBalance(_x51, _x52) {
    return _ref27.apply(this, arguments);
  };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/* eslint no-underscore-dangle: [2, { "allow": ["_eventName"] }] */

var _ = require('lodash');
var Qweb3 = require('qweb3').default;
var Contract = require('qweb3').Contract;

var config = require('../config/config');
var connectDB = require('../db/nedb');

var qclient = new Qweb3(config.QTUM_RPC_ADDRESS);

var Topic = require('./models/topic');
var CentralizedOracle = require('./models/centralizedOracle');
var DecentralizedOracle = require('./models/decentralizedOracle');
var Vote = require('./models/vote');
var OracleResultSet = require('./models/oracleResultSet');
var FinalResultSet = require('./models/finalResultSet');

var Contracts = require('../config/contract_metadata');

var batchSize = 200;

var contractDeployedBlockNum = 78893;

var senderAddress = 'qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy'; // hardcode sender address as it doesnt matter

var RPC_BATCH_SIZE = 20;

var startSync = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var db;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return connectDB();

          case 2:
            db = _context.sent;

            sync(db);

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function startSync() {
    return _ref.apply(this, arguments);
  };
}();

function sequentialLoop(iterations, process, exit) {
  var index = 0;
  var done = false;
  var shouldExit = false;

  var loop = {
    next: function next() {
      if (done) {
        if (shouldExit && exit) {
          return exit();
        }
      }

      if (index < iterations) {
        index++;
        process(loop);
      } else {
        done = true;

        if (exit) {
          exit();
        }
      }
    },
    iteration: function iteration() {
      return index - 1; // Return the loop number we're on
    },
    break: function _break(end) {
      done = true;
      shouldExit = end;
    }
  };
  loop.next();
  return loop;
}

module.exports = startSync;