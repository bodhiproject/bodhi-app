const _ = require('lodash');
const pubsub = require('../pubsub');
const fetch = require('node-fetch');

const DEFAULT_LIMIT_NUM = 50;
const DEFAULT_SKIP_NUM = 0;

function buildCursorOptions(cursor, orderBy, limit, skip) {
  if (!_.isEmpty(orderBy)) {
    sort_dict = {};
    _.forEach(orderBy, (order) => {
      sort_dict[order.field] = order.direction === "ASC" ? 1:-1;
    })

    cursor.sort(sort_dict);
  }

  cursor.limit(limit || DEFAULT_LIMIT_NUM);
  cursor.skip(skip || DEFAULT_SKIP_NUM);

  return cursor
}

function buildTopicFilters({OR = [], address, status}) {
  var filter = (address || status) ? {} : null;
  if (address) {
    filter._id = address;
  }

  if (status) {
    filter.status = status;
  }

  let filters = filter ? [filter] : [];
  for (let i = 0; i < OR.length; i++) {
    filters = filters.concat(buildTopicFilters(OR[i]));
  }
  return filters;
}

function buildOracleFilters({OR = [], address, topicAddress, resultSetterQAddress, status, token}) {
  var filter = (address || topicAddress || resultSetterQAddress || status || token) ? {}: null;
  if (address) {
    filter._id = address;
  }

  if (topicAddress) {
    filter.topicAddress = topicAddress;
  }

  if(resultSetterQAddress){
    filter.resultSetterQAddress = resultSetterQAddress;
  }

  if (status) {
    filter.status = status;
  }

  if (token) {
    filter.token = token;
  }

  let filters = filter ? [filter] : [];
  for (let i = 0; i < OR.length; i++) {
    filters = filters.concat(buildOracleFilters(OR[i]));
  }

  return filters;
}

function buildSearchOracleFilter(searchPhrase) {
  const filterFields = ["name", "_id", "topicAddress", "resultSetterAddress", "resultSetterQAddress"];
  if (!searchPhrase) {
    return [];
  }

  filters = [];
  for (let i = 0; i < filterFields.length; i++) {
    const filter = {};
    filter[filterFields[i]] = { $regex: `.*${searchPhrase}.*` };
    filters.push(filter)
  }

  return filters;
}

function buildVoteFilters({ OR = [], oracleAddress, voterAddress, voterQAddress, optionIdx }) {
  var filter = ( oracleAddress || voterAddress || voterQAddress || optionIdx) ? {} : null;

  if (oracleAddress) {
    filter.oracleAddress = oracleAddress;
  }

  if (voterAddress) {
    filter.voterAddress = voterAddress;
  }

  if (voterQAddress) {
    filter.voterQAddress = voterQAddress;
  }

  if (optionIdx) {
    filter.optionIdx = optionIdx;
  }

  let filters = filter ? [filter] : [];
  for (let i = 0; i < OR.length; i++) {
    filters = filters.concat(buildVoteFilters(OR[i]));
  }
  return filters;
}

module.exports = {
  Query: {
    allTopics: async (root, { filter, orderBy, limit, skip }, {db: {Topics}}) => {
      let query = filter ? {$or: buildTopicFilters(filter)}: {};
      var cursor = Topics.cfind(query);
      cursor = buildCursorOptions(cursor, orderBy, limit, skip);

      return await cursor.exec();
    },

    allOracles: async (root, { filter, orderBy, limit, skip }, {db: {Oracles}}) => {
      let query = filter ? {$or: buildOracleFilters(filter)}: {};
      var cursor = Oracles.cfind(query);
      cursor = buildCursorOptions(cursor, orderBy, limit, skip);
      return await cursor.exec();
    },

    searchOracles: async (root, { searchPhrase, orderBy, limit, skip }, {db: {Oracles}}) => {
      let query = searchPhrase ? {$or: buildSearchOracleFilter(searchPhrase)}: {};
      var cursor = Oracles.cfind(query);
      cursor = buildCursorOptions(cursor, orderBy, limit, skip);
      return await cursor.exec();
    },

    allVotes: async (root, { filter, orderBy, limit, skip }, {db: {Votes}}) => {
      let query = filter ? {$or: buildVoteFilters(filter)}: {};
      var cursor = Votes.cfind(query);
      cursor = buildCursorOptions(cursor, orderBy, limit, skip);
      return await cursor.exec();
    },

    syncInfo: async (root, {}, {db: {Blocks}}) => {
      let syncBlockNum = null;
      let blocks;
      try {
        blocks = await Blocks.cfind({}).sort({blockNum:-1}).limit(1).exec();
      } catch(err){
        console.error(`Error query latest block from db: ${err.message}`);
      }

      if(blocks.length > 0){
        syncBlockNum = blocks[0].blockNum;
      }

      let chainBlockNum = null;
      try {
       let resp = await fetch('https://testnet.qtum.org/insight-api/status?q=getInfo');
       let json = await resp.json();
       chainBlockNum = json['info']['blocks'];
      } catch(err) {
        console.error(`Error GET https://testnet.qtum.org/insight-api/status?q=getInfo: ${err.message}`);
      }

      return {'syncBlockNum': syncBlockNum, 'chainBlockNum': chainBlockNum }
    }
  },

  Mutation: {
    createTopic: async (root, data, {db: {Topics}}) => {
      data.status = 'CREATED';
      data.qtumAmount = Array(data.options.length).fill(0);
      data.botAmount = Array(data.options.length).fill(0);

      const response = await Topics.insert(data);
      const newTopic = Object.assign({ id: response.insertedIds[0] }, data);

      pubsub.publish('Topic', { Topic: { mutation: 'CREATED', node: newTopic } });
      return newTopic;
    },

    createOracle: async (root, data, {db: {Oracles}}) => {
      data.status = 'CREATED';
      data.amounts = Array(data.options.length).fill(0);

      const response = await Oracles.insert(data);
      const newOracle = Object.assign({ id: response.insertedIds[0] }, data);

      return newOracle;
    },

    createVote: async (root, data, {db: {Votes}}) => {
      const response = await Votes.insert(data);
      return Object.assign({ id: response.insertedIds[0] }, data);
    }
  },

  Topic: {
    oracles: async ({address}, data, {db: {Oracles}}) => {
      return await Oracles.find({topicAddress: address});
    }
  },

  Subscription: {
    Topic: {
      subscribe: () => pubsub.asyncIterator('Topic'),
    },
  },
};