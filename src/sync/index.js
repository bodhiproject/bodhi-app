const resolvers = require('../schema/resolvers');
const _ = require('lodash');
const connectDB = require('../db')

const Qweb3 = require('../qweb3.js/src/qweb3');
const qclient = new Qweb3('http://bodhi:bodhi@localhost:13889');

const Topic = require('./models/topic');
const CentralizedOracle = require('./models/centralizedOracle');
const DecentralizedOracle = require('./models/decentralizedOracle');
const Vote = require('./models/vote');
const OracleResultSet = require('./models/oracleResultSet');
const FinalResultSet = require('./models/finalResultSet');

const Contracts = require('./contracts');

const batchSize=500;

const contractDeployedBlockNum = 48000;

const senderAddress = 'qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy'; // hardcode sender address as it doesnt matter

var currentBlockChainHeight = 0

function sequentialLoop(iterations, process, exit){
  var index = 0, done=false, shouldExit=false;

  var loop = {
      next:function(){
        if(done){
          if(shouldExit && exit){
            return exit();
          }
        }

        if(index < iterations){
          index++;
          process(loop);
        }else{
          done = true;

          if(exit){
            exit();
          }
        }
      },

      iteration:function(){
        return index - 1; // Return the loop number we're on
      },

      break:function(end){
        done = true;
        shouldExit = end;
      },
  };
  loop.next();
  return loop;
}

function sync(db){
  const removeHexPrefix = true;
  var topicsNeedBalanceUpdate = new Set(), oraclesNeedBalanceUpdate = new Set();

  qclient.getBlockCount()
    .then(
      (value)=>{
        currentBlockChainHeight = value - 1;
        var options = {
          "limit": 1,
          "sort": [["blockNum", 'desc']]
        }

        db.Blocks.find({}, options).toArray(function(err, blocks){
          var startBlock = contractDeployedBlockNum;
          if(blocks.length > 0){
            startBlock = Math.max(blocks[0].blockNum + 1, startBlock);
          }

          var initialSync = sequentialLoop(Math.ceil((currentBlockChainHeight-startBlock)/batchSize), function(loop){
            var endBlock = Math.min(startBlock + batchSize, currentBlockChainHeight);
            var syncTopic = false, syncCOracle = false, syncDOracle = false, syncVote = false,
                syncOracleResult = false, syncFinalResult = false;

            // sync TopicCreated
            qclient.searchLogs(startBlock, endBlock, Contracts.EventFactory.address, [Contracts.EventFactory.TopicCreated], Contracts, removeHexPrefix)
              .then(
                (result) => {
                  console.log(`${startBlock} - ${endBlock}: Retrieved ${result.length} entries from TopicCreated`);
                  // write to db
                  _.forEach(result, (event, index) => {
                    let blockNum = event.blockNumber;
                    let txid = event.transactionHash;
                    _.forEachRight(event.log, (rawLog) => {
                      if(rawLog['_eventName'] === 'TopicCreated'){
                        var topic = new Topic(blockNum, txid, rawLog).translate();
                        db.Topics.insert(topic);
                      }
                    })
                  });

                  syncTopic = true;

                  if (syncTopic && syncCOracle && syncDOracle && syncVote && syncOracleResult && syncFinalResult){
                    for(var i=startBlock; i<=endBlock; i++) {
                      db.Blocks.insert({'blockNum': i});
                    }
                    startBlock = endBlock+1;
                    loop.next();
                  }
                },
              (err) => {
                console.log(err.message);
                syncTopic = true;
                if (syncTopic && syncCOracle && syncDOracle && syncVote && syncOracleResult && syncFinalResult){
                  for(var i=startBlock; i<=endBlock; i++) {
                    db.Blocks.insert({'blockNum': i});
                  }
                  startBlock = endBlock+1;
                  loop.next();
                }
              });

            // sync CentralizedOracleCreatedEvent
            qclient.searchLogs(startBlock, endBlock, Contracts.EventFactory.address, [Contracts.OracleFactory.CentralizedOracleCreated], Contracts, removeHexPrefix)
            .then(
              (result) => {
                console.log(`${startBlock} - ${endBlock}: Retrieved ${result.length} entries from CentralizedOracleCreatedEvent`);
                // write to db
                _.forEach(result, (event, index) => {
                  let blockNum = event.blockNumber;
                  let txid = event.transactionHash;
                  _.forEachRight(event.log, (rawLog) => {
                    if(rawLog['_eventName'] === 'CentralizedOracleCreated'){
                      var centralOracle = new CentralizedOracle(blockNum, txid, rawLog).translate();
                      db.Oracles.insert(centralOracle);
                    }
                  })
                });

                syncCOracle = true;

                if (syncTopic && syncCOracle && syncDOracle && syncVote && syncOracleResult && syncFinalResult){
                  for(var i=startBlock; i<=endBlock; i++) {
                    db.Blocks.insert({'blockNum': i});
                  }
                  startBlock = endBlock+1;
                  loop.next();
                }
              },
            (err) => {
              console.log(err.message);
              syncCOracle = true;
              if (syncTopic && syncCOracle && syncDOracle && syncVote && syncOracleResult && syncFinalResult){
                for(var i=startBlock; i<=endBlock; i++) {
                  db.Blocks.insert({'blockNum': i});
                }
                startBlock = endBlock+1;
                loop.next();
              }
            });

            // sync DecentralizedOracleCreatedEvent
            qclient.searchLogs(startBlock, endBlock, [], Contracts.OracleFactory.DecentralizedOracleCreated, Contracts, removeHexPrefix)
            .then(
              (result) => {
                console.log(`${startBlock} - ${endBlock}: Retrieved ${result.length} entries from DecentralizedOracleCreatedEvent`);
                // write to db
                _.forEach(result, (event, index) => {
                  let blockNum = event.blockNumber;
                  let txid = event.transactionHash;
                  _.forEachRight(event.log, (rawLog) => {
                    if(rawLog['_eventName'] === 'DecentralizedOracleCreated'){
                      var decentralOracle = new DecentralizedOracle(blockNum, txid, rawLog).translate();
                      db.Oracles.insert(decentralOracle);
                    }
                  })
                });

                syncDOracle = true;

                if (syncTopic && syncCOracle && syncDOracle && syncVote && syncOracleResult && syncFinalResult){
                  for(var i=startBlock; i<=endBlock; i++) {
                    db.Blocks.insert({'blockNum': i});
                  }
                  startBlock = endBlock+1;
                  loop.next();
                }
              },
            (err) => {
              console.log(err.message);

              syncDOracle = true;
              if (syncTopic && syncCOracle && syncDOracle && syncVote && syncOracleResult && syncFinalResult){
                for(var i=startBlock; i<=endBlock; i++) {
                  db.Blocks.insert({'blockNum': i});
                }
                startBlock = endBlock+1;
                loop.next();
              }
            });

            // sync OracleResultVoted
            qclient.searchLogs(startBlock, endBlock, [], Contracts.CentralizedOracle.OracleResultVoted, Contracts, removeHexPrefix)
            .then(
              (result) => {
                console.log(`${startBlock} - ${endBlock}: Retrieved ${result.length} entries from OracleResultVoted`);
                // write to db
                _.forEach(result, (event, index) => {
                  let blockNum = event.blockNumber;
                  let txid = event.transactionHash;
                  _.forEachRight(event.log, (rawLog) => {
                    if(rawLog['_eventName'] === 'OracleResultVoted'){
                      var vote = new Vote(blockNum, txid, rawLog).translate();
                      oraclesNeedBalanceUpdate.add(vote.oracleAddress);
                      db.Votes.insert(vote);
                    }
                  })
                });

                syncVote = true;

                if (syncTopic && syncCOracle && syncDOracle && syncVote && syncOracleResult && syncFinalResult){
                  for(var i=startBlock; i<=endBlock; i++) {
                    db.Blocks.insert({'blockNum': i});
                  }
                  startBlock = endBlock+1;
                  loop.next();
                }
              },
            (err) => {
              console.log(err.message);

              syncVote = true;
              if (syncTopic && syncCOracle && syncDOracle && syncVote && syncOracleResult && syncFinalResult){
                for(var i=startBlock; i<=endBlock; i++) {
                  db.Blocks.insert({'blockNum': i});
                }
                startBlock = endBlock+1;
                loop.next();
              }
            });

            // sync OracleResultSet
            qclient.searchLogs(startBlock, endBlock, [], Contracts.CentralizedOracle.OracleResultSet, Contracts, removeHexPrefix)
            .then(
              (result) => {
                console.log(`${startBlock} - ${endBlock}: Retrieved ${result.length} entries from OracleResultSet`);
                // write to db
                _.forEach(result, (event, index) => {
                  _.forEachRight(event.log, (rawLog) => {
                    if(rawLog['_eventName'] === 'OracleResultSet'){
                      var oracleResult = new OracleResultSet(rawLog).translate();
                      // safeguard to update balance, can be removed in the future
                      oraclesNeedBalanceUpdate.add(oracleResult.oracleAddress);
                      db.Oracles.findAndModify({address: oracleResult.oracleAddress}, [['_id','desc']], {$set: {resultIdx: oracleResult.resultIdx, status:'PENDING'}}, {});
                    }
                  })
                });

                syncOracleResult = true;

                if (syncTopic && syncCOracle && syncDOracle && syncVote && syncOracleResult && syncFinalResult){
                  for(var i=startBlock; i<=endBlock; i++) {
                    db.Blocks.insert({'blockNum': i});
                  }
                  startBlock = endBlock+1;
                  loop.next();
                }
              },
            (err) => {
              console.log(err.message);
              syncOracleResult = true;
              if (syncTopic && syncCOracle && syncDOracle && syncVote && syncOracleResult && syncFinalResult){
                for(var i=startBlock; i<=endBlock; i++) {
                  db.Blocks.insert({'blockNum': i});
                }
                startBlock = endBlock+1;
                loop.next();
              }
            });

            // sync FinalResultSet
            qclient.searchLogs(startBlock, endBlock, [], Contracts.TopicEvent.FinalResultSet, Contracts, removeHexPrefix)
            .then(
              (result) => {
                console.log(`${startBlock} - ${endBlock}: Retrieved ${result.length} entries from FinalResultSet`);
                // write to db
                _.forEach(result, (event, index) => {
                  _.forEachRight(event.log, (rawLog) => {
                    if(rawLog['_eventName'] === 'FinalResultSet'){
                      var topicResult = new FinalResultSet(rawLog).translate();

                      // safeguard to update balance, can be removed in the future
                      topicsNeedBalanceUpdate.add(topicResult.topicAddress);

                      db.Topics.findAndModify({address: topicResult.topicAddress}, [['_id','desc']], {$set: {resultIdx: topicResult.resultIdx, status:'WITHDRAW'}}, {}, function(err, object) {
                        if (err){
                            console.warn(err.message);  // returns error if no matching object found
                        }
                      });

                      db.Oracles.findAndModify({topicAddress: topicResult.topicAddress}, [], {$set: {resultIdx: topicResult.resultIdx, status:'WITHDRAW'}}, {}, function(err, object) {
                        if (err){
                            console.warn(err.message);  // returns error if no matching object found
                        }
                      });
                    }
                  })
                });

                syncFinalResult = true;

                if (syncTopic && syncCOracle && syncDOracle && syncVote && syncOracleResult && syncFinalResult){
                  for(var i=startBlock; i<=endBlock; i++) {
                    db.Blocks.insert({'blockNum': i});
                  }
                  startBlock = endBlock+1;
                  loop.next();
                }
              },
            (err) => {
              console.log(err.message);
              syncFinalResult = true;
              if (syncTopic && syncCOracle && syncDOracle && syncVote && syncOracleResult && syncFinalResult){
                for(var i=startBlock; i<=endBlock; i++) {
                  db.Blocks.insert({'blockNum': i});
                }
                startBlock = endBlock+1;
                loop.next();
              }
            });
        }, function(){
            let updateOraclesPassedEndBlockPromise = new Promise((resolve) => {
              updateOraclesPassedEndBlock(currentBlockChainHeight, db, resolve);
            })

            var oraclesNeedBalanceUpdateArray = Array.from(oraclesNeedBalanceUpdate)
            let promiseStack = oraclesNeedBalanceUpdateArray.map((oracle_address) => {
              return new Promise((resolve) => {
                updateOracleBalance(oracle_address, topicsNeedBalanceUpdate, db, resolve);
              });
            })

            promiseStack.push(updateOraclesPassedEndBlockPromise);

            Promise.all(promiseStack).then(() => {
              var topicsNeedBalanceUpdateArray = Array.from(topicsNeedBalanceUpdate)
              let promiseStack2 = topicsNeedBalanceUpdateArray.map((topic_address) => {
                return new Promise((resolve) => {
                  updateTopicBalance(topic_address, db, resolve);
                });
              })

              let updateOraclesPassedResultSetEndBlockPromise = new Promise((resolve) => {
                updateCentralizedOraclesPassedResultSetEndBlock(currentBlockChainHeight, db, resolve);
              })

              promiseStack2.push(updateOraclesPassedResultSetEndBlockPromise);
              console.log('Update Oracles Balance done');
              Promise.all(promiseStack2).then(() => {
                console.log('Update Topic Balance done');
                db.Connection.close();
                console.log('sleep');
                setTimeout(startSync, 5000);
              });
            });
          });
    });
  });
}

function updateOraclesPassedEndBlock(currentBlockChainHeight, db, resolve){
  // all central & decentral oracles with VOTING status and endBlock less than currentBlockChainHeight
  db.Oracles.findAndModify({endBlock: {$lt:currentBlockChainHeight}, status: 'VOTING'}, [],
    {$set: {status:'WAITRESULT'}}, {}, function(err, object) {
    if (err){
      console.warn(err.message);  // returns error if no matching object found
    }
    console.log('Update Oracles Passed EndBlock done');
    resolve();
  });
}

function updateCentralizedOraclesPassedResultSetEndBlock(currentBlockChainHeight, db, resolve){
  // central oracels with WAITRESULT status and resultSetEndBlock less than  currentBlockChainHeight
  db.Oracles.findAndModify({resultSetEndBlock: {$lt: currentBlockChainHeight}, token: 'QTUM', status: 'WAITRESULT'}, [],
    {$set: {status:'OPENRESULTSET'}}, {}, function(err, object){
      if (err){
        console.warn(err.message);
      }
      console.log('Update Oracles Passed ResultSetEndBlock done');
      resolve();
    });
}

function updateOracleBalance(oracleAddress, topicSet, db, resolve){
  db.Oracles.findOne({address: oracleAddress}).then(function(oracle){
    if(!oracle){
      resolve();
      return;
    }
    // related topic should be updated
    topicSet.add(oracle.topicAddress);
    if(oracle.token === 'QTUM'){
      // centrailized
      const contract = qclient.Contract(oracleAddress, Contracts.CentralizedOracle.abi);
      contract.call('getTotalBets',{ methodArgs: [], senderAddress: senderAddress})
        .then(
          (value)=>{
            let balances = _.map(value[0].slice(0, oracle.options.length), (balance_BN) =>{
              return balance_BN.toJSON();
            });
            db.Oracles.updateOne({address: oracleAddress}, { $set: { amounts: balances } }, function(err, res){
              if(err){
                console.warn(err.message);
              }
              resolve();
            });
          }
        );
    }else{
      // decentralized
      const contract = qclient.Contract(oracleAddress, Contracts.DecentralizedOracle.abi);
      contract.call('getTotalVotes', { methodArgs: [], senderAddress: senderAddress})
      .then(
        (value)=>{
          let balances = _.map(value[0].slice(0, oracle.options.length), (balance_BN) =>{
            return balance_BN.toJSON();
          });
          db.Oracles.updateOne({address: oracleAddress}, { $set: { amounts: balances } }, function(err, res){
            if(err){
              console.warn(err.message);
            }
            resolve();
          });
        }
      );
    }
  });
}

function updateTopicBalance(topicAddress, db, resolve){
  db.Topics.findOne({address: topicAddress}).then(function(topic){
    if(!topic){
      resolve();
      return;
    }
    const contract = qclient.Contract(topicAddress, Contracts.TopicEvent.abi);
    contract.call('getTotalBets', { methodArgs: [], senderAddress: senderAddress})
      .then(
        (value)=>{
          let balances = _.map(value[0].slice(0, topic.options.length), (balance_BN) =>{
            return balance_BN.toJSON();
          });
          db.Topics.updateOne({address: topicAddress}, { $set: { qtumAmount: balances } }, function(err, res){
            if(err){
              console.warn(err.message);
            }
            resolve();
          });
      });

    contract.call('getTotalVotes', { methodArgs: [], senderAddress: senderAddress})
      .then(
        (value)=>{
          let balances = _.map(value[0].slice(0, topic.options.length), (balance_BN) =>{
            return balance_BN.toJSON();
          });
          db.Topics.updateOne({address: topicAddress}, { $set: { botAmount: balances } }, function(err, res){
            if(err){
              console.warn(err.message);
            }
            resolve();
          });
      });
  });
}

const startSync = async () => {
  const mongoDB = await connectDB();
  sync(mongoDB)
};

module.exports = startSync;
