const _ = require('lodash');
const Qweb3 = require('qweb3').default;
const Contract = require('qweb3').Contract;

const config = require('../config');
const connectDB = require('../db/nedb')

const qclient = new Qweb3(config.QTUM_RPC_ADDRESS);

const Topic = require('./models/topic');
const CentralizedOracle = require('./models/centralizedOracle');
const DecentralizedOracle = require('./models/decentralizedOracle');
const Vote = require('./models/vote');
const OracleResultSet = require('./models/oracleResultSet');
const FinalResultSet = require('./models/finalResultSet');

const Contracts = require('./contracts');

const batchSize = 200;

const contractDeployedBlockNum = 70653;

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

  var startBlock = contractDeployedBlockNum;
  let blocks = await db.Blocks.cfind({}).sort({blockNum: -1}).limit(1).exec();
  if (blocks.length > 0){
    startBlock = Math.max(blocks[0].blockNum + 1, startBlock);
  }

  var initialSync = sequentialLoop(Math.ceil((currentBlockChainHeight-startBlock)/batchSize), async function(loop) {
    var endBlock = Math.min(startBlock + batchSize - 1, currentBlockChainHeight);
    var syncTopic = false, syncCOracle = false, syncDOracle = false, syncVote = false, syncOracleResult = false, syncFinalResult = false;

    await syncTopicCreated(db, startBlock, endBlock, removeHexPrefix);
    console.log('Synced Topics\n');

    await Promise.all([
      syncCentralizedOracleCreated(db, startBlock, endBlock, removeHexPrefix),
      syncDecentralizedOracleCreated(db, startBlock, endBlock, removeHexPrefix),
      syncOracleResultVoted(db, startBlock, endBlock, removeHexPrefix, oraclesNeedBalanceUpdate),
    ]);
    console.log('Synced Oracles\n');

    await Promise.all([
      syncOracleResultSet(db, startBlock, endBlock, removeHexPrefix, oraclesNeedBalanceUpdate),
      syncFinalResultSet(db, startBlock, endBlock, removeHexPrefix, topicsNeedBalanceUpdate),
    ]);
    console.log('Synced Result Set\n');

    const updateBlockPromises = [];
    for (let i = startBlock; i <= endBlock; i++) {
      let updateBlockPromise = new Promise(async (resolve) => {
        let resp = await db.Blocks.insert({'_id': i, 'blockNum': i});
        resolve();
      });
      updateBlockPromises.push(updateBlockPromise);
    }
    await Promise.all(updateBlockPromises);
    console.log('Inserted Blocks\n');

    startBlock = endBlock + 1;
    loop.next();
  },
  async function() {
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

      // nedb doesnt require close db, leave the comment as a reminder
      // await db.Connection.close();
      console.log('sleep');
      setTimeout(startSync, 5000);
    });
  });
}

async function fetchNameOptionsFromTopic(db, address) {
  var topic = await db.Topics.findOne({_id: address}, {name: 1, options: 1});
  if (!topic) {
    throw Error(`could not find Topic ${address} in db`);
  } else {
    return topic;
  }
}

async function syncTopicCreated(db, startBlock, endBlock, removeHexPrefix) {
  let result;
  try {
    result = await qclient.searchLogs(startBlock, endBlock, Contracts.EventFactory.address,
      [Contracts.EventFactory.TopicCreated], Contracts, removeHexPrefix);
    console.log('searchlog TopicCreated')
  } catch(err) {
    console.error(`ERROR: ${err.message}`);
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
            console.error(`ERROR: ${err.message}`);
            resolve();
            return;
          }
        });

        createTopicPromises.push(insertTopicDB);
      }
    });
  });

  await Promise.all(createTopicPromises);
}

async function syncCentralizedOracleCreated(db, startBlock, endBlock, removeHexPrefix) {
  let result;
  try {
    result = await qclient.searchLogs(startBlock, endBlock, Contracts.EventFactory.address,
      [Contracts.OracleFactory.CentralizedOracleCreated], Contracts, removeHexPrefix);
    console.log('searchlog CentralizedOracleCreated')
  } catch(err) {
    console.error(`ERROR: ${err.message}`);
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
            const topic = await fetchNameOptionsFromTopic(db, centralOracle.topicAddress);

            centralOracle.name = topic.name;
            centralOracle.options = topic.options;

            await db.Oracles.insert(centralOracle);
            resolve();
          } catch(err) {
            console.error(`ERROR: ${err.message}`);
            resolve();
          }
        });

        createCentralizedOraclePromises.push(insertOracleDB);
      }
    });
  });

  await Promise.all(createCentralizedOraclePromises);
}

async function syncDecentralizedOracleCreated(db, startBlock, endBlock, removeHexPrefix) {
  let result;
  try {
    result = await qclient.searchLogs(startBlock, endBlock, [], Contracts.OracleFactory.DecentralizedOracleCreated,
      Contracts, removeHexPrefix)
    console.log('searchlog DecentralizedOracleCreated')
  } catch(err) {
    console.error(`ERROR: ${err.message}`);
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
            const topic = await fetchNameOptionsFromTopic(db, decentralOracle.topicAddress);

            decentralOracle.name = topic.name;
            decentralOracle.options = topic.options;
            await db.Oracles.insert(decentralOracle);
            resolve();
          } catch(err) {
            console.error(`ERROR: ${err.message}`);
            resolve();
          }
        });
        createDecentralizedOraclePromises.push(insertOracleDB);
      }
    });
  });

  await Promise.all(createDecentralizedOraclePromises);
}

async function syncOracleResultVoted(db, startBlock, endBlock, removeHexPrefix, oraclesNeedBalanceUpdate) {
  let result;
  try {
    result = await qclient.searchLogs(startBlock, endBlock, [], Contracts.CentralizedOracle.OracleResultVoted,
      Contracts, removeHexPrefix)
    console.log('searchlog OracleResultVoted')
  } catch(err) {
    console.error(`ERROR: ${err.message}`);
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
            console.error(`ERROR: ${err.message}`);
            resolve();
          }
        });

        createOracleResultVotedPromises.push(insertVoteDB);
      }
    });
  });

  await Promise.all(createOracleResultVotedPromises);
}

async function syncOracleResultSet(db, startBlock, endBlock, removeHexPrefix, oraclesNeedBalanceUpdate) {
  let result;
  try {
    result = await qclient.searchLogs(startBlock, endBlock, [], Contracts.CentralizedOracle.OracleResultSet, Contracts,
      removeHexPrefix)
    console.log('searchlog OracleResultSet')
  } catch(err) {
    console.error(`ERROR: ${err.message}`);
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

            await db.Oracles.update({_id: oracleResult.oracleAddress},
              {$set: {resultIdx: oracleResult.resultIdx, status:'PENDING'}}, {});
            resolve();
          } catch(err) {
            console.error(`ERROR: ${err.message}`);
            resolve();
          }
        });

        updateOracleResultSetPromises.push(updateOracleResult);
      }
    });
  })

  await Promise.all(updateOracleResultSetPromises);
}

async function syncFinalResultSet(db, startBlock, endBlock, removeHexPrefix, topicsNeedBalanceUpdate) {
  let result;
  try {
    result = await qclient.searchLogs(startBlock, endBlock, [], Contracts.TopicEvent.FinalResultSet, Contracts,
      removeHexPrefix)
    console.log('searchlog FinalResultSet')
  } catch(err) {
    console.error(`ERROR: ${err.message}`);
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

            await db.Topics.update({_id: topicResult.topicAddress},
              {$set: {resultIdx: topicResult.resultIdx, status:'WITHDRAW'}});

            await db.Oracles.update({topicAddress: topicResult.topicAddress},
              {$set: {resultIdx: topicResult.resultIdx, status:'WITHDRAW'}}, {multi: true});
            resolve();
          } catch(err) {
            console.error(`ERROR: ${err.message}`);
            resolve();
          }
        });

        updateFinalResultSetPromises.push(updateFinalResultSet);
      }
    });
  });

  await Promise.all(updateFinalResultSetPromises);
}

async function updateOraclesPassedEndBlock(currentBlockChainHeight, db, resolve){
  // all central & decentral oracles with VOTING status and endBlock less than currentBlockChainHeight
  try {
    await db.Oracles.update({endBlock: {$lt:currentBlockChainHeight}, status: 'VOTING'}, {$set: {status:'WAITRESULT'}}, {multi: true});
    console.log('Updated Oracles Passed EndBlock');
  }catch(err){
    console.error(`ERROR: updateOraclesPassedEndBlock ${err.message}`);
  }
}

async function updateCentralizedOraclesPassedResultSetEndBlock(currentBlockChainHeight, db){
  // central oracels with WAITRESULT status and resultSetEndBlock less than  currentBlockChainHeight
  try {
    await db.Oracles.update({resultSetEndBlock: {$lt: currentBlockChainHeight}, token: 'QTUM', status: 'WAITRESULT'},
      {$set: {status:'OPENRESULTSET'}}, {multi: true});
    console.log('Updated COracles Passed ResultSetEndBlock');
  }catch(err){
    console.error(`ERROR: updateCentralizedOraclesPassedResultSetEndBlock ${err.message}`);
  }
}

async function updateOracleBalance(oracleAddress, topicSet, db){
  var oracle;
  try {
    oracle = await db.Oracles.findOne({_id: oracleAddress});
    if (!oracle){
      console.error(`ERROR: find 0 oracle ${oracleAddress} in db to update`);
      return;
    }
  } catch(err){
    console.error(`ERROR: update oracle ${oracleAddress} in db, ${err.message}`);
    return;
  }

  // related topic should be updated
  topicSet.add(oracle.topicAddress);
  var value;
  if(oracle.token === 'QTUM'){
    // centrailized
    const contract = new Contract(config.QTUM_RPC_ADDRESS, oracleAddress, Contracts.CentralizedOracle.abi);
    try {
      value = await contract.call('getTotalBets',{ methodArgs: [], senderAddress: senderAddress});
    } catch(err){
      console.error(`ERROR: getTotalBets for oracle ${oracleAddress}, ${err.message}`);
      return;
    }
  }else{
    // decentralized
    const contract = new Contract(config.QTUM_RPC_ADDRESS, oracleAddress, Contracts.DecentralizedOracle.abi);
    try {
      value = await contract.call('getTotalVotes', { methodArgs: [], senderAddress: senderAddress});
    } catch(err){
      console.error(`ERROR: getTotalVotes for oracle ${oracleAddress}, ${err.message}`);
      return;
    }
  }

  let balances = _.map(value[0].slice(0, oracle.numOfResults), (balance_BN) => {
    return balance_BN.toJSON();
  });

  try {
    await db.Oracles.update({_id: oracleAddress}, { $set: { amounts: balances }});
    console.log(`Update oracle ${oracleAddress} amounts ${balances}`);
  } catch(err){
    console.error(`ERROR: update oracle ${oracleAddress}, ${err.message}`);
  }
}

async function updateTopicBalance(topicAddress, db){
  var topic;
  try{
    topic = await db.Topics.findOne({_id: topicAddress});
    if (!topic){
      console.error(`ERROR: find 0 topic ${topicAddress} in db to update`);
      return;
    }
  } catch(err){
    console.error(`ERROR: find topic ${topicAddress} in db, ${err.message}`);
    return;
  }

  const contract = new Contract(config.QTUM_RPC_ADDRESS, topicAddress, Contracts.TopicEvent.abi);
  var totalBetsValue, totalVotesValue;
  try {
    var getTotalBetsPromise = contract.call('getTotalBets', { methodArgs: [], senderAddress: senderAddress});
    var getTotalVotesPromise = contract.call('getTotalVotes', { methodArgs: [], senderAddress: senderAddress});
    totalBetsValue = await getTotalBetsPromise;
    totalVotesValue = await getTotalVotesPromise;
  } catch(err){
    console.error(`ERROR: getTotalBets for topic ${topicAddress}, ${err.message}`);
    return;
  }

  let totalBetsBalances = _.map(totalBetsValue[0].slice(0, topic.options.length), (balance_BN) =>{
    return balance_BN.toJSON();
  });

  let totalVotesBalances = _.map(totalVotesValue[0].slice(0, topic.options.length), (balance_BN) =>{
    return balance_BN.toJSON();
  });

  try {
    await db.Topics.update({_id: topicAddress}, { $set: { qtumAmount: totalBetsBalances, botAmount: totalVotesBalances }});
    console.log(`Update topic ${topicAddress} qtumAmount ${totalBetsBalances} botAmount ${totalVotesBalances}`);
  }catch(err){
    console.error(`ERROR: update topic ${topicAddress} in db, ${err.message}`);
  }
}

const startSync = async () => {
  const db = await connectDB();
  sync(db)
};

module.exports = startSync;
