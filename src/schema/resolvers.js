const pubsub = require('../pubsub');


function buildTopicFilters({OR = [], address, status}) {
  const filter = (address || status) ? {} : null;
  if (address) {
    filter.address = {$eq: `${address}`};
  }

  if (status) {
    filter.status = {$eq: `${status}`};
  }

  let filters = filter ? [filter] : [];
  for (let i = 0; i < OR.length; i++) {
    filters = filters.concat(buildTopicFilters(OR[i]));
  }
  return filters;
}

function buildOracleFilters({OR = [], address, topicAddress, status}) {
  const filter = (address || topicAddress || status) ? {}: null;
  if (address) {
    filter.address = {$eq: `${address}`};
  }

  if (topicAddress) {
    filter.topicAddress = {$eq: `${topicAddress}`};
  }

  if (status) {
    filter.status = {$eq: `${status}`};
  }

  let filters = filter ? [filter]:[]
  for (let i = 0; i < OR.length; i++) {
    filters = filters.concat(buildOracleFilters(OR[i]));
  }
  return filters;
}

function buildSearchOracleFilter(searchPhrase) {
  const filterFields = ["name", "address", "creatorAddress", "topicAddress"];
  if (!searchPhrase) {
    return [];
  }

  filters = [];
  for (let i=0; i < filterFields.length; i++){
    const filter = {};
    filter[filterFields[i]] = {$regex: `.*${searchPhrase}.*`};
    filters.push(filter)
  }

  return filters;
}

function buildVoteFilters({OR = [], address, oracleAddress, voterAddress, optionIdx}) {
  const filter = (address || oracleAddress || voterAddress || optionIdx) ? {} : null;
  if (address) {
    filter.address = {$eq: `${address}`};
  }

  if (oracleAddress) {
    filter.oracleAddress = {$eq: `${oracleAddress}`};
  }

  if (voterAddress) {
    filter.voterAddress = {$eq: `${voterAddress}`};
  }

  if (optionIdx) {
    filter.optionIdx = {$eq: `${optionIdx}`};
  }

  let filters = filter ? [filter]: [];
  for (let i = 0; i < OR.length; i++) {
    filters = filters.concat(buildVoteFilters(OR[i]));
  }
  return filters;
}


module.exports = {
  Query: {
    allTopics: async (root, {filter, first, skip, orderBy}, {mongo: {Topics}}) => {
      let query = filter ? {$or: buildTopicFilters(filter)}: {};
      const cursor = Topics.find(query);
      if (first) {
        cursor.limit(first);
      }

      if (skip) {
        cursor.skip(skip);
      }

      return await cursor.toArray();
    },

    allOracles: async (root, {filter, first, skip, orderBy}, {mongo: {Oracles}}) => {
      let query = filter ? {$or: buildOracleFilters(filter)}: {};
      const cursor = Oracles.find(query);
      if (first) {
        cursor.limit(first);
      }

      if (skip) {
        cursor.skip(skip);
      }
      return await cursor.toArray();
    },

    searchOracles: async (root, {searchPhrase, first, skip, orderBy}, {mongo: {Oracles}}) => {
      let query = searchPhrase ? {$or: buildSearchOracleFilter(searchPhrase)}: {};
      const cursor = Oracles.find(query);
      if (first) {
        cursor.limit(first);
      }

      if (skip) {
        cursor.skip(skip);
      }
      return await cursor.toArray();
    },

    allVotes: async (root, {filter, first, skip, orderBy}, {mongo: {Votes}}) => {
      let query = filter ? {$or: buildVoteFilters(filter)}: {};
      const cursor = Votes.find(query);
      if (first) {
        cursor.limit(first);
      }

      if (skip) {
        cursor.skip(skip);
      }
      return await cursor.toArray();
    }
  },

  Mutation: {
    createTopic: async (root, data, {mongo: {Topics}}) => {
      data.status = 'CREATED';
      data.qtumAmount = Array(data.options.length).fill(0);
      data.botAmount = Array(data.options.length).fill(0);

      const response = await Topics.insert(data);
      const newTopic = Object.assign({id: response.insertedIds[0]}, data);

      pubsub.publish('Topic', {Topic:{mutation: 'CREATED', node:newTopic}});
      return newTopic;
    },

    createOracle: async (root, data, {mongo: {Oracles}}) => {
      data.status = 'CREATED';
      data.amounts = Array(data.options.length).fill(0);

      const response = await Oracles.insert(data);
      const newOracle = Object.assign({id: response.insertedIds[0]}, data);

      return newOracle;
    },

    createVote: async (root, data, {mongo: {Votes}}) => {
      const response = await Votes.insert(data);
      return Object.assign({id: response.insertedIds[0]}, data);
    }
  },

  Topic: {
    oracles: async ({address}, data, {mongo: {Oracles}}) => {
      return await Oracles.find({topicAddress: address}).toArray();
    }
  },

  Subscription: {
    Topic: {
      subscribe: () => pubsub.asyncIterator('Topic'),
    },
  },
};