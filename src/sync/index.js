const _ = require('lodash');
const config = require('../config');
const connectDB = require('../db')

const Qweb3 = require('qweb3');
const Qweb3Contract = require('qweb3/src/contract');
const qclient = new Qweb3(config.QTUM_RPC_ADDRESS);


const Topic = require('./models/topic');
const CentralizedOracle = require('./models/centralizedOracle');
const DecentralizedOracle = require('./models/decentralizedOracle');
const Vote = require('./models/vote');
const OracleResultSet = require('./models/oracleResultSet');
const FinalResultSet = require('./models/finalResultSet');

const Contracts = require('./contracts');

const batchSize=200;

const contractDeployedBlockNum = 56958;

const senderAddress = 'qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy'; // hardcode sender address as it doesnt matter

const RPC_BATCH_SIZE = 20;

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
      console.log('Synced Topics & Oracles');
      // sync first and then update in case update object in current batch
      Promise.all(updatePromises).then(() =>{
        console.log('Updated OracleResult & FinalResult');

        const updateBlockPromises = [];
        for (var i=startBlock; i<=endBlock; i++) {
          let updateBlockPromise = new Promise(async (resolve) => {
            let resp = await db.Blocks.insert({'blockNum': i});
            resolve();
          });
          updateBlockPromises.push(updateBlockPromise);
        }

        Promise.all(updateBlockPromises).then(() => {
          startBlock = endBlock+1;
          loop.next();
        });
      });
    });
  },
  async function(){
    var oracle_address_batches = _.chunk(Array.from(oraclesNeedBalanceUpdate), RPC_BATCH_SIZE);
    // execute rpc batch by batch
    sequentialLoop(oracle_address_batches.length, async function(loop) {
      var iteration = loop.iteration();
      console.log(`oracle batch: ${iteration}`);
      await Promise.all(oracle_address_batches[iteration].map(async (oracle_address) => {
        await updateOracleBalance(oracle_address, topicsNeedBalanceUpdate, db);
      }));

      // Oracle balance update completed
      if (iteration === oracle_address_batches.length - 1){
        // two rpc call per topic balance so batch_size = RPC_BATCH_SIZE/2
        var topic_address_batches = _.chunk(Array.from(topicsNeedBalanceUpdate), Math.floor(RPC_BATCH_SIZE/2));
        sequentialLoop(topic_address_batches.length, async function(topicLoop) {
          var iteration = topicLoop.iteration();
          console.log(`topic batch: ${iteration}`);
          await Promise.all(topic_address_batches[iteration].map(async (topic_address) => {
            await updateTopicBalance(topic_address, db);
          }));
          console.log('next topic batch');
          topicLoop.next();
        }, function() {
          console.log('Updated topics balance');
          loop.next();
        });
      } else {
        console.log('next oracle batch');
        loop.next();
      }
    }, async function() {
      await updateOraclesPassedEndBlock(currentBlockChainHeight, db);
      // must ensure updateCentralizedOraclesPassedResultSetEndBlock after updateOraclesPassedEndBlock
      await updateCentralizedOraclesPassedResultSetEndBlock(currentBlockChainHeight, db);
      await db.Connection.close();
      console.log('sleep');
      setTimeout(startSync, 5000);
    });
  });
}

async function updateOraclesPassedEndBlock(currentBlockChainHeight, db, resolve){
  // all central & decentral oracles with VOTING status and endBlock less than currentBlockChainHeight
  try {
    await db.Oracles.findAndModify({endBlock: {$lt:currentBlockChainHeight}, status: 'VOTING'}, [], {$set: {status:'WAITRESULT'}}, {});
    console.log('Updated Oracles Passed EndBlock');
  }catch(err){
    console.error(`Error: updateOraclesPassedEndBlock ${err.message}`);
  }
}

async function updateCentralizedOraclesPassedResultSetEndBlock(currentBlockChainHeight, db){
  // central oracels with WAITRESULT status and resultSetEndBlock less than  currentBlockChainHeight
  try {
    await db.Oracles.findAndModify({resultSetEndBlock: {$lt: currentBlockChainHeight}, token: 'QTUM', status: 'WAITRESULT'}, [],
      {$set: {status:'OPENRESULTSET'}}, {});
    console.log('Updated COracles Passed ResultSetEndBlock');
  }catch(err){
    console.error(`Error: updateCentralizedOraclesPassedResultSetEndBlock ${err.message}`);
  }
}

async function updateOracleBalance(oracleAddress, topicSet, db){
  var oracle;
  try {
    oracle = await db.Oracles.findOne({address: oracleAddress});
    if (!oracle){
      console.error(`Error: find 0 oracle ${oracleAddress} in db to update`);
      return;
    }
  } catch(err){
    console.error(`Error: update oracle ${oracleAddress} in db, ${err.message}`);
    return;
  }

  // related topic should be updated
  topicSet.add(oracle.topicAddress);
  var value;
  if(oracle.token === 'QTUM'){
    // centrailized
    const contract = new Qweb3Contract(config.QTUM_RPC_ADDRESS, oracleAddress, Contracts.CentralizedOracle.abi);
    try {
      value = await contract.call('getTotalBets',{ methodArgs: [], senderAddress: senderAddress});
    } catch(err){
      console.error(`Error: getTotalBets for oracle ${oracleAddress}, ${err.message}`);
      return;
    }
  }else{
    // decentralized
    const contract = new Qweb3Contract(config.QTUM_RPC_ADDRESS, oracleAddress, Contracts.DecentralizedOracle.abi);
    try {
      value = await contract.call('getTotalVotes', { methodArgs: [], senderAddress: senderAddress});
    } catch(err){
      console.error(`Error: getTotalVotes for oracle ${oracleAddress}, ${err.message}`);
      return;
    }
  }

  let balances = _.map(value[0].slice(0, oracle.options.length), (balance_BN) => {
    return balance_BN.toJSON();
  });

  try {
    await db.Oracles.updateOne({address: oracleAddress}, { $set: { amounts: balances }});
    console.log(`Update oracle ${oracleAddress} amounts ${balances}`);
  } catch(err){
    console.error(`Error: update oracle ${oracleAddress}, ${err.message}`);
  }
}

async function updateTopicBalance(topicAddress, db){
  var topic;
  try{
    topic = await db.Topics.findOne({address: topicAddress});
    if (!topic){
      console.error(`Error: find 0 topic ${topicAddress} in db to update`);
      return;
    }
  } catch(err){
    console.error(`Error: find topic ${topicAddress} in db, ${err.message}`);
    return;
  }

  const contract = new Qweb3Contract(config.QTUM_RPC_ADDRESS, topicAddress, Contracts.TopicEvent.abi);
  var totalBetsValue, totalVotesValue;
  try{
    // TODO(frankobe): mk this two async
    totalBetsValue = await contract.call('getTotalBets', { methodArgs: [], senderAddress: senderAddress});
    totalVotesValue = await contract.call('getTotalVotes', { methodArgs: [], senderAddress: senderAddress});
  }catch(err){
    console.error(`Error: getTotalBets for topic ${topicAddress}, ${err.message}`);
    return;
  }

  let totalBetsBalances = _.map(totalBetsValue[0].slice(0, topic.options.length), (balance_BN) =>{
    return balance_BN.toJSON();
  });

  let totalVotesBalances = _.map(totalVotesValue[0].slice(0, topic.options.length), (balance_BN) =>{
    return balance_BN.toJSON();
  });

  try {
    await db.Topics.updateOne({address: topicAddress}, { $set: { qtumAmount: totalBetsBalances, botAmount: totalVotesBalances }});
    console.log(`Update topic ${topicAddress} qtumAmount ${totalBetsBalances} botAmount ${totalVotesBalances}`);
  }catch(err){
    console.error(`Error: update topic ${topicAddress} in db, ${err.message}`);
  }
}

const startSync = async () => {
  const mongoDB = await connectDB();
  sync(mongoDB)
};

module.exports = startSync;
