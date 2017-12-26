const resolvers = require('../schema/resolvers');
const _ = require('lodash');
const connectDB = require('../db')

const Qweb3 = require('qweb3');
const qclient = new Qweb3('http://bodhi:bodhi@localhost:13889');

const Topic = require('./models/topic');
const CentralizedOracle = require('./models/centralizedOracle');
const DecentralizedOracle = require('./models/decentralizedOracle');
const Vote = require('./models/vote');
const OracleResultSet = require('./models/oracleResultSet');
const FinalResultSet = require('./models/finalResultSet');

const Contracts = require('./contracts');

const batchSize=500;

const contractDeployedBlockNum = 56958;

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

async function sync(db){
  const removeHexPrefix = true;
  var topicsNeedBalanceUpdate = new Set(), oraclesNeedBalanceUpdate = new Set();

  let currentBlockChainHeight = await qclient.getBlockCount();
  currentBlockChainHeight = currentBlockChainHeight - 1;
  let options = {
    "limit": 1,
    "sort": [["blockNum", 'desc']]
  }

  var startBlock = contractDeployedBlockNum;
  let blocks = await db.Blocks.find({}, options).toArray();
  if(blocks.length > 0){
    startBlock = Math.max(blocks[0].blockNum + 1, startBlock);
  }

  var initialSync = sequentialLoop(Math.ceil((currentBlockChainHeight-startBlock)/batchSize), function(loop){
    var endBlock = Math.min(startBlock + batchSize - 1, currentBlockChainHeight);
    var syncTopic = false, syncCOracle = false, syncDOracle = false, syncVote = false, syncOracleResult = false, syncFinalResult = false;

    // sync TopicCreated
    var syncTopicCreatedPromise = new Promise(async (resolve) => {
      let result;
      try {
        result = await qclient.searchLogs(startBlock, endBlock, Contracts.EventFactory.address, [Contracts.EventFactory.TopicCreated], Contracts, removeHexPrefix);
        console.log('searchlog TopicCreated')
      } catch(err) {
        console.error(`Error: ${err.message}`);
        resolve();
        return;
      }

      console.log(`${startBlock} - ${endBlock}: Retrieved ${result.length} entries from TopicCreated`);
      var createTopicPromises = [];

      _.forEach(result, (event, index) => {
        let blockNum = event.blockNumber;
        let txid = event.transactionHash;
        _.forEachRight(event.log, (rawLog) => {
          if(rawLog['_eventName'] === 'TopicCreated'){
            var insertTopicDB = new Promise(async (resolve) =>{
              try {
                var topic = new Topic(blockNum, txid, rawLog).translate();
                await db.Topics.insert(topic);
                resolve();
              } catch(err) {
                console.error(`Error: ${err.message}`);
                resolve();
                return;
              }
            });

            createTopicPromises.push(insertTopicDB);
          }
        });
      });

      Promise.all(createTopicPromises).then(()=>{
        resolve()
      });
    });

    // sync CentralizedOracleCreated
    var syncCentralizedOracleCreatedPromise = new Promise(async (resolve) => {
      let result;
      try {
        result = await qclient.searchLogs(startBlock, endBlock, Contracts.EventFactory.address, [Contracts.OracleFactory.CentralizedOracleCreated], Contracts, removeHexPrefix);
        console.log('searchlog CentralizedOracleCreated')
      } catch(err) {
        console.error(`Error: ${err.message}`);
        resolve();
        return;
      }

      console.log(`${startBlock} - ${endBlock}: Retrieved ${result.length} entries from CentralizedOracleCreated`);
      var createCentralizedOraclePromises = [];

      _.forEach(result, (event, index) => {
        let blockNum = event.blockNumber;
        let txid = event.transactionHash;
        _.forEachRight(event.log, (rawLog) => {
          if(rawLog['_eventName'] === 'CentralizedOracleCreated'){
            var insertOracleDB = new Promise(async (resolve) =>{
              try {
                var centralOracle = new CentralizedOracle(blockNum, txid, rawLog).translate();
                await db.Oracles.insert(centralOracle);
                resolve();
              } catch(err) {
                console.error(`Error: ${err.message}`);
                resolve();
                return;
              }
            });

            createCentralizedOraclePromises.push(insertOracleDB);
          }
        });
      });

      Promise.all(createCentralizedOraclePromises).then(()=>{
        resolve()
      });
    });

    // sync DecentralizedOracleCreated
    var syncDecentralizedOracleCreatedPromise = new Promise(async (resolve) => {
      let result;
      try {
        result = await qclient.searchLogs(startBlock, endBlock, [], Contracts.OracleFactory.DecentralizedOracleCreated, Contracts, removeHexPrefix)
        console.log('searchlog DecentralizedOracleCreated')
      } catch(err) {
        console.error(`Error: ${err.message}`);
        resolve();
        return;
      }

      console.log(`${startBlock} - ${endBlock}: Retrieved ${result.length} entries from DecentralizedOracleCreated`);
      var createDecentralizedOraclePromises = [];

      _.forEach(result, (event, index) => {
        let blockNum = event.blockNumber;
        let txid = event.transactionHash;
        _.forEachRight(event.log, (rawLog) => {
          if(rawLog['_eventName'] === 'DecentralizedOracleCreated'){
            var insertOracleDB = new Promise(async (resolve) =>{
              try {
                var decentralOracle = new DecentralizedOracle(blockNum, txid, rawLog).translate();
                await db.Oracles.insert(decentralOracle);
                resolve();
              } catch(err) {
                console.error(`Error: ${err.message}`);
                resolve();
                return;
              }
            });
            createDecentralizedOraclePromises.push(insertOracleDB);
          }
        });
      });

      Promise.all(createDecentralizedOraclePromises).then(()=>{
        resolve()
      });
    });

    // sync OracleResultVoted
    var syncOracleResultVotedPromise = new Promise(async (resolve) => {
      let result;
      try {
        result = await qclient.searchLogs(startBlock, endBlock, [], Contracts.CentralizedOracle.OracleResultVoted, Contracts, removeHexPrefix)
        console.log('searchlog OracleResultVoted')
      } catch(err) {
        console.error(`Error: ${err.message}`);
        resolve();
        return;
      }

      console.log(`${startBlock} - ${endBlock}: Retrieved ${result.length} entries from OracleResultVoted`);
      var createOracleResultVotedPromises = [];

      _.forEach(result, (event, index) => {
        let blockNum = event.blockNumber;
        let txid = event.transactionHash;
        _.forEachRight(event.log, (rawLog) => {
          if(rawLog['_eventName'] === 'OracleResultVoted'){
            var insertVoteDB = new Promise(async (resolve) =>{
              try {
                var vote = new Vote(blockNum, txid, rawLog).translate();
                oraclesNeedBalanceUpdate.add(vote.oracleAddress);

                await db.Votes.insert(vote);
                resolve();
              } catch(err){
                console.error(`Error: ${err.message}`);
                resolve();
                return;
              }
            });

            createOracleResultVotedPromises.push(insertVoteDB);
          }
        });
      });

      Promise.all(createOracleResultVotedPromises).then(()=>{
        resolve()
      });
    });

    // sync OracleResultSet
    var syncOracleResultSetPromise = new Promise(async (resolve) => {
      let result;
      try {
        result = await qclient.searchLogs(startBlock, endBlock, [], Contracts.CentralizedOracle.OracleResultSet, Contracts, removeHexPrefix)
        console.log('searchlog OracleResultSet')
      } catch(err) {
        console.error(`Error: ${err.message}`);
        resolve();
        return;
      }

      console.log(`${startBlock} - ${endBlock}: Retrieved ${result.length} entries from OracleResultSet`);
      var updateOracleResultSetPromises = [];

      _.forEach(result, (event, index) => {
        _.forEachRight(event.log, (rawLog) => {
          if(rawLog['_eventName'] === 'OracleResultSet'){
            var updateOracleResult = new Promise(async (resolve) =>{
              try {
                var oracleResult = new OracleResultSet(rawLog).translate();
                // safeguard to update balance, can be removed in the future
                oraclesNeedBalanceUpdate.add(oracleResult.oracleAddress);

                await db.Oracles.findAndModify({address: oracleResult.oracleAddress}, [['_id','desc']], {$set: {resultIdx: oracleResult.resultIdx, status:'PENDING'}}, {});
                resolve();
              } catch(err) {
                console.error(`Error: ${err.message}`);
                resolve();
                return;
              }
            });

            updateOracleResultSetPromises.push(updateOracleResult);
          }
        });
      });

      Promise.all(updateOracleResultSetPromises).then(()=>{
        resolve()
      });
    });

    // sync FinalResultSet
    var syncFinalResultSetPromise = new Promise(async (resolve) => {
      let result;
      try {
        result = await qclient.searchLogs(startBlock, endBlock, [], Contracts.TopicEvent.FinalResultSet, Contracts, removeHexPrefix)
        console.log('searchlog FinalResultSet')
      } catch(err) {
        console.error(`Error: ${err.message}`);
        resolve();
        return;
      }

      console.log(`${startBlock} - ${endBlock}: Retrieved ${result.length} entries from FinalResultSet`);
      var updateFinalResultSetPromises = [];

      _.forEach(result, (event, index) => {
        _.forEachRight(event.log, (rawLog) => {
          if(rawLog['_eventName'] === 'FinalResultSet'){
            var updateFinalResultSet = new Promise(async (resolve) =>{
              try {
                var topicResult = new FinalResultSet(rawLog).translate();
                // safeguard to update balance, can be removed in the future
                topicsNeedBalanceUpdate.add(topicResult.topicAddress);

                await db.Topics.findAndModify({address: topicResult.topicAddress}, [['_id','desc']], {$set: {resultIdx: topicResult.resultIdx, status:'WITHDRAW'}}, {});
                resolve();
              } catch(err) {
                console.error(`Error: ${err.message}`);
                resolve();
                return;
              }
            });

            updateFinalResultSetPromises.push(updateFinalResultSet);
          }
        });
      });

      Promise.all(updateFinalResultSetPromises).then(()=>{
        resolve()
      });
    });

    var syncPromises = [];
    var updatePromises = [];
    syncPromises.push(syncTopicCreatedPromise);
    syncPromises.push(syncCentralizedOracleCreatedPromise);
    syncPromises.push(syncDecentralizedOracleCreatedPromise);
    syncPromises.push(syncOracleResultVotedPromise);
    updatePromises.push(syncOracleResultSetPromise);
    updatePromises.push(syncFinalResultSetPromise);

    Promise.all(syncPromises).then(() => {
      console.log('synced');
      // sync first and then update in case update object in current batch
      Promise.all(updatePromises).then(() =>{
        console.log('updated');

        const updateBlockPromises = [];
        for (var i=startBlock; i<=endBlock; i++) {
          let updateBlockPromise = new Promise(async (resolve) => {
            let resp = await db.Blocks.insert({'blockNum': i});
            resolve();
          });
          updateBlockPromises.push(updateBlockPromise);
        }

        Promise.all(updateBlockPromises).then(() => {
          console.log('next')
          startBlock = endBlock+1;
          loop.next();
        });
      });
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
}

function updateOraclesPassedEndBlock(currentBlockChainHeight, db, resolve){
  // all central & decentral oracles with VOTING status and endBlock less than currentBlockChainHeight
  db.Oracles.findAndModify({endBlock: {$lt:currentBlockChainHeight}, status: 'VOTING'}, [],
    {$set: {status:'WAITRESULT'}}, {}, function(err, object) {
    if (err){
      console.error(`Error: ${err.message}`); // returns error if no matching object found
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
        console.error(`Error: ${err.message}`);
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
                console.error(`Error: ${err.message}`);
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
              console.error(`Error: ${err.message}`);
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
              console.error(`Error: ${err.message}`);
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
              console.error(`Error: ${err.message}`);
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
