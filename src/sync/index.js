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
const contractEventFactory = qclient.Contract(Contracts.EventFactory.address, Contracts.EventFactory.abi);
const contractOracleFactory = qclient.Contract(Contracts.OracleFactory.address, Contracts.OracleFactory.abi);
const contractTopicEvent = qclient.Contract(null, Contracts.TopicEvent.abi);
const contractCentralizedOracle = qclient.Contract(null, Contracts.CentralizedOracle.abi);
const contractDecentralizedOracle = qclient.Contract(null, Contracts.DecentralizedOracle.abi);

const batchSize=100;

const contractDeployedBlockNum = 48000;

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
  qclient.getBlockCount()
    .then(
      (value)=>{
        currentBlockChainHeight = value - 1;
        var options = {
          "limit": 1,
          "sort": [["blockNum", 'desc']]
        }

        db.Blocks.find({}, options).toArray(function(err, blocks){
          var start_block = contractDeployedBlockNum;
          if(blocks.length > 0){
            start_block = Math.max(blocks[0].blockNum + 1, start_block);
          }

          var initialSync = sequentialLoop(Math.ceil((currentBlockChainHeight-start_block)/batchSize), function(loop){
            var end_block = Math.min(start_block + batchSize, currentBlockChainHeight);
            var syncTopic = false, syncCOracle = false, syncDOracle = false, syncVote = false,
                syncOracleResult = false, syncFinalResult = false;

            // sync TopicCreated
            contractEventFactory.searchLogs(start_block, end_block, Contracts.EventFactory.address, [Contracts.EventFactory.TopicCreated])
              .then(
                (result) => {
                  console.log(`${start_block} - ${end_block}: Retrieved ${result.length} entries from TopicCreated`);
                  // write to db
                  _.forEach(result, (event, index) => {
                    let blockNum = event.blockNumber;
                    _.forEachRight(event.log, (rawLog) => {
                      if(rawLog['_eventName'] === 'TopicCreated'){
                        var topic = new Topic(blockNum, rawLog);
                        db.Topics.insert(topic.translate());
                      }
                    })
                  });

                  syncTopic = true;

                  if (syncTopic && syncCOracle && syncDOracle && syncVote && syncOracleResult && syncFinalResult){
                    for(var i=start_block; i<=end_block; i++) {
                      db.Blocks.insert({'blockNum': i});
                    }
                    start_block = end_block+1;
                    loop.next();
                  }
                },
              (err) => {
                console.log(err.message);
                syncTopic = true;
                if (syncTopic && syncCOracle && syncDOracle && syncVote && syncOracleResult && syncFinalResult){
                  for(var i=start_block; i<=end_block; i++) {
                    db.Blocks.insert({'blockNum': i});
                  }
                  start_block = end_block+1;
                  loop.next();
                }
              });

            // sync CentrailizedOracleCreatedEvent
            contractOracleFactory.searchLogs(start_block, end_block, Contracts.EventFactory.address, [Contracts.OracleFactory.CentralizedOracleCreated])
            .then(
              (result) => {
                console.log(`${start_block} - ${end_block}: Retrieved ${result.length} entries from CentrailizedOracleCreatedEvent`);
                // write to db
                _.forEach(result, (event, index) => {
                  let blockNum = event.blockNumber
                  _.forEachRight(event.log, (rawLog) => {
                    if(rawLog['_eventName'] === 'CentralizedOracleCreated'){
                      var central_oracle = new CentralizedOracle(blockNum, rawLog);
                      db.Oracles.insert(central_oracle.translate());
                    }
                  })
                });

                syncCOracle = true;

                if (syncTopic && syncCOracle && syncDOracle && syncVote && syncOracleResult && syncFinalResult){
                  for(var i=start_block; i<=end_block; i++) {
                    db.Blocks.insert({'blockNum': i});
                  }
                  start_block = end_block+1;
                  loop.next();
                }
              },
            (err) => {
              console.log(err.message);
              syncCOracle = true;
              if (syncTopic && syncCOracle && syncDOracle && syncVote && syncOracleResult && syncFinalResult){
                for(var i=start_block; i<=end_block; i++) {
                  db.Blocks.insert({'blockNum': i});
                }
                start_block = end_block+1;
                loop.next();
              }
            });

            // sync DecentrailizedOracleCreatedEvent
            contractOracleFactory.searchLogs(start_block, end_block, [], Contracts.OracleFactory.DecentralizedOracleCreated)
            .then(
              (result) => {
                console.log(`${start_block} - ${end_block}: Retrieved ${result.length} entries from DecentrailizedOracleCreatedEvent`);
                // write to db
                _.forEach(result, (event, index) => {
                  let blockNum = event.blockNumber
                  _.forEachRight(event.log, (rawLog) => {
                    if(rawLog['_eventName'] === 'DecentralizedOracleCreated'){
                      var decentral_oracle = new DecentralizedOracle(blockNum, rawLog);
                      db.Oracles.insert(decentral_oracle.translate());
                    }
                  })
                });

                syncDOracle = true;

                if (syncTopic && syncCOracle && syncDOracle && syncVote && syncOracleResult && syncFinalResult){
                  for(var i=start_block; i<=end_block; i++) {
                    db.Blocks.insert({'blockNum': i});
                  }
                  start_block = end_block+1;
                  loop.next();
                }
              },
            (err) => {
              console.log(err.message);

              syncDOracle = true;
              if (syncTopic && syncCOracle && syncDOracle && syncVote && syncOracleResult && syncFinalResult){
                for(var i=start_block; i<=end_block; i++) {
                  db.Blocks.insert({'blockNum': i});
                }
                start_block = end_block+1;
                loop.next();
              }
            });

            // sync OracleResultVoted
            contractCentralizedOracle.searchLogs(start_block, end_block, [], Contracts.CentralizedOracle.OracleResultVoted)
            .then(
              (result) => {
                console.log(`${start_block} - ${end_block}: Retrieved ${result.length} entries from OracleResultVoted`);
                // write to db
                _.forEach(result, (event, index) => {
                  let blockNum = event.blockNumber
                  _.forEachRight(event.log, (rawLog) => {
                    if(rawLog['_eventName'] === 'OracleResultVoted'){
                      var vote = new Vote(blockNum, rawLog);
                      db.Votes.insert(vote.translate());
                    }
                  })
                });

                syncVote = true;

                if (syncTopic && syncCOracle && syncDOracle && syncVote && syncOracleResult && syncFinalResult){
                  for(var i=start_block; i<=end_block; i++) {
                    db.Blocks.insert({'blockNum': i});
                  }
                  start_block = end_block+1;
                  loop.next();
                }
              },
            (err) => {
              console.log(err.message);

              syncVote = true;
              if (syncTopic && syncCOracle && syncDOracle && syncVote && syncOracleResult && syncFinalResult){
                for(var i=start_block; i<=end_block; i++) {
                  db.Blocks.insert({'blockNum': i});
                }
                start_block = end_block+1;
                loop.next();
              }
            });

            // sync OracleResultSet
            contractCentralizedOracle.searchLogs(start_block, end_block, [], Contracts.CentralizedOracle.OracleResultSet)
            .then(
              (result) => {
                console.log(`${start_block} - ${end_block}: Retrieved ${result.length} entries from OracleResultSet`);
                // write to db
                _.forEach(result, (event, index) => {
                  let blockNum = event.blockNumber
                  _.forEachRight(event.log, (rawLog) => {
                    if(rawLog['_eventName'] === 'OracleResultSet'){
                      var oracle_result = new OracleResultSet(blockNum, rawLog);
                      db.Oracles.findAndModify({address: oracle_result.oracleAddress}, [['_id','desc']], {$set: {resultIdx: oracle_result.resultIdx, status:'PENDING'}}, {});
                    }
                  })
                });

                syncOracleResult = true;

                if (syncTopic && syncCOracle && syncDOracle && syncVote && syncOracleResult && syncFinalResult){
                  for(var i=start_block; i<=end_block; i++) {
                    db.Blocks.insert({'blockNum': i});
                  }
                  start_block = end_block+1;
                  loop.next();
                }
              },
            (err) => {
              console.log(err.message);
              syncOracleResult = true;
              if (syncTopic && syncCOracle && syncDOracle && syncVote && syncOracleResult && syncFinalResult){
                for(var i=start_block; i<=end_block; i++) {
                  db.Blocks.insert({'blockNum': i});
                }
                start_block = end_block+1;
                loop.next();
              }
            });

            // sync FinalResultSet
            contractTopicEvent.searchLogs(start_block, end_block, [], Contracts.TopicEvent.FinalResultSet)
            .then(
              (result) => {
                console.log(`${start_block} - ${end_block}: Retrieved ${result.length} entries from FinalResultSet`);
                // write to db
                _.forEach(result, (event, index) => {
                  let blockNum = event.blockNumber
                  _.forEachRight(event.log, (rawLog) => {
                    if(rawLog['_eventName'] === 'FinalResultSet'){
                      var topic_result = new FinalResultSet(blockNum, rawLog).translate();
                      db.Topics.findAndModify({address: topic_result.topicAddress}, [['_id','desc']], {$set: {resultIdx: topic_result.resultIdx, status:'WITHDRAW'}}, {}, function(err, object) {
                        if (err){
                            console.warn(err.message);  // returns error if no matching object found
                        }
                      });

                      db.Oracles.findAndModify({topicAddress: topic_result.topicAddress}, [], {$set: {resultIdx: topic_result.resultIdx, status:'WITHDRAW'}}, {}, function(err, object) {
                        if (err){
                            console.warn(err.message);  // returns error if no matching object found
                        }
                      });
                    }
                  })
                });

                syncFinalResult = true;

                if (syncTopic && syncCOracle && syncDOracle && syncVote && syncOracleResult && syncFinalResult){
                  for(var i=start_block; i<=end_block; i++) {
                    db.Blocks.insert({'blockNum': i});
                  }
                  start_block = end_block+1;
                  loop.next();
                }
              },
            (err) => {
              console.log(err.message);
              syncFinalResult = true;
              if (syncTopic && syncCOracle && syncDOracle && syncVote && syncOracleResult && syncFinalResult){
                for(var i=start_block; i<=end_block; i++) {
                  db.Blocks.insert({'blockNum': i});
                }
                start_block = end_block+1;
                loop.next();
              }
            });
        }, function(){
            // update all oracles passed endblock
            db.Oracles.findAndModify({endBlock: {$lt:currentBlockChainHeight}, status: 'VOTING'}, [], {$set: {status:'WAITRESULT'}}, {}, function(err, object) {
              if (err){
                  console.warn(err.message);  // returns error if no matching object found
              }
              console.log('sleep');
              setTimeout(startSync, 5000);
            });
      });
    });
  });
}

const startSync = async () => {
  const mongoDB = await connectDB();
  sync(mongoDB)
};

module.exports = startSync;
