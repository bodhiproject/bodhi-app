/* eslint no-underscore-dangle: [2, { "allow": ["_eventName"] }] */

const _ = require('lodash');
const { Qweb3, Contract } = require('qweb3');

const logger = require('../utils/logger');

const config = require('../config/config');
const connectDB = require('../db/nedb');

const qclient = new Qweb3(config.QTUM_RPC_ADDRESS);

const Topic = require('./models/topic');
const CentralizedOracle = require('./models/centralizedOracle');
const DecentralizedOracle = require('./models/decentralizedOracle');
const Vote = require('./models/vote');
const OracleResultSet = require('./models/oracleResultSet');
const FinalResultSet = require('./models/finalResultSet');

const Contracts = require('../config/contract_metadata');

const batchSize = 200;

const contractDeployedBlockNum = 78893;

const senderAddress = 'qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy'; // hardcode sender address as it doesnt matter

const RPC_BATCH_SIZE = 20;

const startSync = async () => {
  const db = await connectDB();
  sync(db);
};

function sequentialLoop(iterations, process, exit) {
  let index = 0;
  let done = false;
  let shouldExit = false;

  const loop = {
    next() {
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

    iteration() {
      return index - 1; // Return the loop number we're on
    },

    break(end) {
      done = true;
      shouldExit = end;
    },
  };
  loop.next();
  return loop;
}

async function sync(db) {
  const removeHexPrefix = true;
  const topicsNeedBalanceUpdate = new Set();
  const oraclesNeedBalanceUpdate = new Set();

  let currentBlockChainHeight = await qclient.getBlockCount();
  currentBlockChainHeight -= 1;

  const currentBlockHash = await qclient.getBlockHash(currentBlockChainHeight);
  const currentBlockTime = (await qclient.getBlock(currentBlockHash)).time;

  let startBlock = contractDeployedBlockNum;
  const blocks = await db.Blocks.cfind({}).sort({ blockNum: -1 }).limit(1).exec();
  if (blocks.length > 0) {
    startBlock = Math.max(blocks[0].blockNum + 1, startBlock);
  }

  sequentialLoop(
    Math.ceil((currentBlockChainHeight - startBlock) / batchSize), async (loop) => {
      const endBlock = Math.min((startBlock + batchSize) - 1, currentBlockChainHeight);

      await syncTopicCreated(db, startBlock, endBlock, removeHexPrefix);
      logger.debug('Synced Topics');

      await Promise.all([
        syncCentralizedOracleCreated(db, startBlock, endBlock, removeHexPrefix),
        syncDecentralizedOracleCreated(db, startBlock, endBlock, removeHexPrefix, currentBlockTime),
        syncOracleResultVoted(db, startBlock, endBlock, removeHexPrefix, oraclesNeedBalanceUpdate),
      ]);
      logger.debug('Synced Oracles');

      await Promise.all([
        syncOracleResultSet(db, startBlock, endBlock, removeHexPrefix, oraclesNeedBalanceUpdate),
        syncFinalResultSet(db, startBlock, endBlock, removeHexPrefix, topicsNeedBalanceUpdate),
      ]);
      logger.debug('Synced Result Set');

      const updateBlockPromises = [];
      for (let i = startBlock; i <= endBlock; i++) {
        const updateBlockPromise = new Promise(async (resolve) => {
          await db.Blocks.insert({
            _id: i,
            blockNum: i,
            blockTime: currentBlockTime,
          });
          resolve();
        });
        updateBlockPromises.push(updateBlockPromise);
      }
      await Promise.all(updateBlockPromises);
      logger.debug('Inserted Blocks');

      startBlock = endBlock + 1;
      loop.next();
    },
    async () => {
      const oracleAddressBatches = _.chunk(Array.from(oraclesNeedBalanceUpdate), RPC_BATCH_SIZE);
      // execute rpc batch by batch
      sequentialLoop(oracleAddressBatches.length, async (loop) => {
        const oracleIteration = loop.iteration();
        logger.debug(`oracle batch: ${oracleIteration}`);
        await Promise.all(oracleAddressBatches[oracleIteration].map(async (oracleAddress) => {
          await updateOracleBalance(oracleAddress, topicsNeedBalanceUpdate, db);
        }));

        // Oracle balance update completed
        if (oracleIteration === oracleAddressBatches.length - 1) {
        // two rpc call per topic balance so batch_size = RPC_BATCH_SIZE/2
          const topicAddressBatches = _.chunk(Array.from(topicsNeedBalanceUpdate), Math.floor(RPC_BATCH_SIZE / 2));
          sequentialLoop(topicAddressBatches.length, async (topicLoop) => {
            const topicIteration = topicLoop.iteration();
            logger.debug(`topic batch: ${topicIteration}`);
            await Promise.all(topicAddressBatches[topicIteration].map(async (topicAddress) => {
              await updateTopicBalance(topicAddress, db);
            }));
            logger.debug('next topic batch');
            topicLoop.next();
          }, () => {
            logger.debug('Updated topics balance');
            loop.next();
          });
        } else {
          logger.debug('next oracle batch');
          loop.next();
        }
      }, async () => {
        await updateOraclesPassedEndTime(currentBlockTime, db);
        // must ensure updateCentralizedOraclesPassedResultSetEndBlock after updateOraclesPassedEndBlock
        await updateCentralizedOraclesPassedResultSetEndTime(currentBlockTime, db);

        // nedb doesnt require close db, leave the comment as a reminder
        // await db.Connection.close();
        logger.debug('sleep');
        setTimeout(startSync, 5000);
      });
    },
  );
}

async function fetchNameOptionsFromTopic(db, address) {
  const topic = await db.Topics.findOne({ _id: address }, { name: 1, options: 1 });
  if (!topic) {
    throw Error(`could not find Topic ${address} in db`);
  } else {
    return topic;
  }
}

async function syncTopicCreated(db, startBlock, endBlock, removeHexPrefix) {
  let result;
  try {
    result = await qclient.searchLogs(
      startBlock, endBlock, Contracts.EventFactory.address,
      [Contracts.EventFactory.TopicCreated], Contracts, removeHexPrefix,
    );
    logger.debug('searchlog TopicCreated');
  } catch (err) {
    logger.error(`ERROR: ${err.message}`);
    return;
  }

  logger.debug(`${startBlock} - ${endBlock}: Retrieved ${result.length} entries from TopicCreated`);
  const createTopicPromises = [];

  _.forEach(result, (event, index) => {
    const blockNum = event.blockNumber;
    const txid = event.transactionHash;
    _.forEachRight(event.log, (rawLog) => {
      if (rawLog._eventName === 'TopicCreated') {
        const insertTopicDB = new Promise(async (resolve) => {
          try {
            const topic = new Topic(blockNum, txid, rawLog).translate();
            await db.Topics.insert(topic);
            resolve();
          } catch (err) {
            logger.error(`ERROR: ${err.message}`);
            resolve();
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
    result = await qclient.searchLogs(
      startBlock, endBlock, Contracts.EventFactory.address,
      [Contracts.OracleFactory.CentralizedOracleCreated], Contracts, removeHexPrefix,
    );
    logger.debug('searchlog CentralizedOracleCreated');
  } catch (err) {
    logger.error(`${err.message}`);
    return;
  }

  logger.debug(`${startBlock} - ${endBlock}: Retrieved ${result.length} entries from CentralizedOracleCreated`);
  const createCentralizedOraclePromises = [];

  _.forEach(result, (event, index) => {
    const blockNum = event.blockNumber;
    const txid = event.transactionHash;
    _.forEachRight(event.log, (rawLog) => {
      if (rawLog._eventName === 'CentralizedOracleCreated') {
        const insertOracleDB = new Promise(async (resolve) => {
          try {
            const centralOracle = new CentralizedOracle(blockNum, txid, rawLog).translate();
            const topic = await fetchNameOptionsFromTopic(db, centralOracle.topicAddress);

            centralOracle.name = topic.name;
            centralOracle.options = topic.options;

            await db.Oracles.insert(centralOracle);
            resolve();
          } catch (err) {
            logger.error(`${err.message}`);
            resolve();
          }
        });

        createCentralizedOraclePromises.push(insertOracleDB);
      }
    });
  });

  await Promise.all(createCentralizedOraclePromises);
}

async function syncDecentralizedOracleCreated(db, startBlock, endBlock, removeHexPrefix, currentBlockTime) {
  let result;
  try {
    result = await qclient.searchLogs(
      startBlock, endBlock, [], Contracts.OracleFactory.DecentralizedOracleCreated,
      Contracts, removeHexPrefix,
    );
    logger.debug('searchlog DecentralizedOracleCreated');
  } catch (err) {
    logger.error(`${err.message}`);
    return;
  }

  logger.debug(`${startBlock} - ${endBlock}: Retrieved ${result.length} entries from DecentralizedOracleCreated`);
  const createDecentralizedOraclePromises = [];

  _.forEach(result, (event, index) => {
    const blockNum = event.blockNumber;
    const txid = event.transactionHash;
    _.forEachRight(event.log, (rawLog) => {
      if (rawLog._eventName === 'DecentralizedOracleCreated') {
        const insertOracleDB = new Promise(async (resolve) => {
          try {
            const decentralOracle = new DecentralizedOracle(blockNum, txid, rawLog).translate();
            const topic = await fetchNameOptionsFromTopic(db, decentralOracle.topicAddress);

            decentralOracle.name = topic.name;
            decentralOracle.options = topic.options;
            decentralOracle.startTime = currentBlockTime;

            await db.Oracles.insert(decentralOracle);
            resolve();
          } catch (err) {
            logger.error(`${err.message}`);
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
    result = await qclient.searchLogs(
      startBlock, endBlock, [], Contracts.CentralizedOracle.OracleResultVoted,
      Contracts, removeHexPrefix,
    );
    logger.debug('searchlog OracleResultVoted');
  } catch (err) {
    logger.error(`${err.message}`);
    return;
  }

  logger.debug(`${startBlock} - ${endBlock}: Retrieved ${result.length} entries from OracleResultVoted`);
  const createOracleResultVotedPromises = [];

  _.forEach(result, (event, index) => {
    const blockNum = event.blockNumber;
    const txid = event.transactionHash;
    _.forEachRight(event.log, (rawLog) => {
      if (rawLog._eventName === 'OracleResultVoted') {
        const insertVoteDB = new Promise(async (resolve) => {
          try {
            const vote = new Vote(blockNum, txid, rawLog).translate();
            oraclesNeedBalanceUpdate.add(vote.oracleAddress);

            await db.Votes.insert(vote);
            resolve();
          } catch (err) {
            logger.error(`${err.message}`);
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
    result = await qclient.searchLogs(
      startBlock, endBlock, [], Contracts.CentralizedOracle.OracleResultSet, Contracts,
      removeHexPrefix,
    );
    logger.debug('searchlog OracleResultSet');
  } catch (err) {
    logger.error(`${err.message}`);
    return;
  }

  logger.debug(`${startBlock} - ${endBlock}: Retrieved ${result.length} entries from OracleResultSet`);
  const updateOracleResultSetPromises = [];

  _.forEach(result, (event, index) => {
    _.forEachRight(event.log, (rawLog) => {
      if (rawLog._eventName === 'OracleResultSet') {
        const updateOracleResult = new Promise(async (resolve) => {
          try {
            const oracleResult = new OracleResultSet(rawLog).translate();
            // safeguard to update balance, can be removed in the future
            oraclesNeedBalanceUpdate.add(oracleResult.oracleAddress);

            await db.Oracles.update(
              { _id: oracleResult.oracleAddress },
              { $set: { resultIdx: oracleResult.resultIdx, status: 'PENDING' } }, {},
            );
            resolve();
          } catch (err) {
            logger.error(`${err.message}`);
            resolve();
          }
        });

        updateOracleResultSetPromises.push(updateOracleResult);
      }
    });
  });

  await Promise.all(updateOracleResultSetPromises);
}

async function syncFinalResultSet(db, startBlock, endBlock, removeHexPrefix, topicsNeedBalanceUpdate) {
  let result;
  try {
    result = await qclient.searchLogs(
      startBlock, endBlock, [], Contracts.TopicEvent.FinalResultSet, Contracts,
      removeHexPrefix,
    );
    logger.debug('searchlog FinalResultSet');
  } catch (err) {
    logger.error(`${err.message}`);
    return;
  }

  logger.debug(`${startBlock} - ${endBlock}: Retrieved ${result.length} entries from FinalResultSet`);
  const updateFinalResultSetPromises = [];

  _.forEach(result, (event, index) => {
    _.forEachRight(event.log, (rawLog) => {
      if (rawLog._eventName === 'FinalResultSet') {
        const updateFinalResultSet = new Promise(async (resolve) => {
          try {
            const topicResult = new FinalResultSet(rawLog).translate();
            // safeguard to update balance, can be removed in the future
            topicsNeedBalanceUpdate.add(topicResult.topicAddress);

            await db.Topics.update(
              { _id: topicResult.topicAddress },
              { $set: { resultIdx: topicResult.resultIdx, status: 'WITHDRAW' } },
            );

            await db.Oracles.update(
              { topicAddress: topicResult.topicAddress },
              { $set: { resultIdx: topicResult.resultIdx, status: 'WITHDRAW' } }, { multi: true },
            );
            resolve();
          } catch (err) {
            logger.error(`${err.message}`);
            resolve();
          }
        });

        updateFinalResultSetPromises.push(updateFinalResultSet);
      }
    });
  });

  await Promise.all(updateFinalResultSetPromises);
}

// all central & decentral oracles with VOTING status and endTime less than currentBlockTime
async function updateOraclesPassedEndTime(currentBlockTime, db) {
  try {
    await db.Oracles.update(
      { endTime: { $lt: currentBlockTime }, status: 'VOTING' },
      { $set: { status: 'WAITRESULT' } },
      { multi: true },
    );
    logger.debug('Updated Oracles Passed EndBlock');
  } catch (err) {
    logger.error(`updateOraclesPassedEndBlock ${err.message}`);
  }
}

// central oracles with WAITRESULT status and resultSetEndTime less than currentBlockTime
async function updateCentralizedOraclesPassedResultSetEndTime(currentBlockTime, db) {
  try {
    await db.Oracles.update(
      { resultSetEndTime: { $lt: currentBlockTime }, token: 'QTUM', status: 'WAITRESULT' },
      { $set: { status: 'OPENRESULTSET' } }, { multi: true },
    );
    logger.debug('Updated COracles Passed ResultSetEndBlock');
  } catch (err) {
    logger.error(`updateCentralizedOraclesPassedResultSetEndBlock ${err.message}`);
  }
}

async function updateOracleBalance(oracleAddress, topicSet, db) {
  let oracle;
  try {
    oracle = await db.Oracles.findOne({ _id: oracleAddress });
    if (!oracle) {
      logger.error(`find 0 oracle ${oracleAddress} in db to update`);
      return;
    }
  } catch (err) {
    logger.error(`update oracle ${oracleAddress} in db, ${err.message}`);
    return;
  }

  // related topic should be updated
  topicSet.add(oracle.topicAddress);
  let value;
  if (oracle.token === 'QTUM') {
    // centrailized
    const contract = new Contract(config.QTUM_RPC_ADDRESS, oracleAddress, Contracts.CentralizedOracle.abi);
    try {
      value = await contract.call('getTotalBets', { methodArgs: [], senderAddress });
    } catch (err) {
      logger.error(`getTotalBets for oracle ${oracleAddress}, ${err.message}`);
      return;
    }
  } else {
    // decentralized
    const contract = new Contract(config.QTUM_RPC_ADDRESS, oracleAddress, Contracts.DecentralizedOracle.abi);
    try {
      value = await contract.call('getTotalVotes', { methodArgs: [], senderAddress });
    } catch (err) {
      logger.error(`getTotalVotes for oracle ${oracleAddress}, ${err.message}`);
      return;
    }
  }

  const balances = _.map(value[0].slice(0, oracle.numOfResults), balanceBN => balanceBN.toJSON());

  try {
    await db.Oracles.update({ _id: oracleAddress }, { $set: { amounts: balances } });
    logger.debug(`Update oracle ${oracleAddress} amounts ${balances}`);
  } catch (err) {
    logger.error(`update oracle ${oracleAddress}, ${err.message}`);
  }
}

async function updateTopicBalance(topicAddress, db) {
  let topic;
  try {
    topic = await db.Topics.findOne({ _id: topicAddress });
    if (!topic) {
      logger.error(`find 0 topic ${topicAddress} in db to update`);
      return;
    }
  } catch (err) {
    logger.error(`find topic ${topicAddress} in db, ${err.message}`);
    return;
  }

  const contract = new Contract(config.QTUM_RPC_ADDRESS, topicAddress, Contracts.TopicEvent.abi);
  let totalBetsValue;
  let totalVotesValue;
  try {
    const getTotalBetsPromise = contract.call('getTotalBets', { methodArgs: [], senderAddress });
    const getTotalVotesPromise = contract.call('getTotalVotes', { methodArgs: [], senderAddress });
    totalBetsValue = await getTotalBetsPromise;
    totalVotesValue = await getTotalVotesPromise;
  } catch (err) {
    logger.error(`getTotalBets for topic ${topicAddress}, ${err.message}`);
    return;
  }

  const totalBetsBalances = _.map(totalBetsValue[0].slice(0, topic.options.length), balanceBN => balanceBN.toJSON());

  const totalVotesBalances = _.map(totalVotesValue[0].slice(0, topic.options.length), balanceBN => balanceBN.toJSON());

  try {
    await db.Topics.update(
      { _id: topicAddress },
      { $set: { qtumAmount: totalBetsBalances, botAmount: totalVotesBalances } },
    );
    logger.debug(`Update topic ${topicAddress} qtumAmount ${totalBetsBalances} botAmount ${totalVotesBalances}`);
  } catch (err) {
    logger.error(`update topic ${topicAddress} in db, ${err.message}`);
  }
}

module.exports = startSync;
