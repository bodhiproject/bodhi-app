const pubsub = require('../pubsub');

function buildTopicFilters({OR = [], address, status}) {
  const filter = (address || status) ? {} : null;
  if (address) {
    filter.address = {$eq: `${address}`}
  }

  if (status) {
    filter.status = {$eq: `${status}`}
  }

  let filters = filter ? [filter] : [];
  for (let i = 0; i < OR.length; i++) {
    filters = filters.concat(buildTopicFilters(OR[i]));
  }
  return filters;
}

function buildSearchOracleFilters({OR = [], topicAddress_contains, name_contains}) {
  const filter = (topicAddress_contains || name_contains) ? {} : null;
  if (topicAddress_contains) {
    filter.topicAddress = {$regex: `.*${topicAddress_contains}.*`};
  }
  if (name_contains) {
    filter.name = {$regex: `.*${name_contains}.*`};
  }

  let filters = filter ? [filter] : [];
  for (let i = 0; i < OR.length; i++) {
    filters = filters.concat(buildSearchOracleFilter(OR[i]));
  }
  return filters;
}

// input TopicFilter {
//   OR: [TopicFilter!]
//   address: String
//   status: _OracleStatusType
// }

// input OracleFilter {
//   OR: [OracleFilter!]
//   address: String
//   topicAddress: String
//   status: _OracleStatusType
// }

// input SearchOracleFilter {
//   OR: [SearchOracleFilter!]
//   address_contains: String
//   name_contains: String
// }

// input VoteFilter {
//   OR: [VoteFilter!]
//   address: String
//   oracleAddress: String
//   voterAddress: String
//   optionIdx: Int
// }

module.exports = {
  Query: {
    allTopics: async (root, {filter, first, skip, orderBy}, {mongo: {Topics}}) => {
      let query = filter ? {$or: buildTopicFilters(filter)}: {}
      const cursor = Topics.find(query)
      if (first) {
        cursor.limit(first)
      }

      if (skip) {
        cursor.skip(skip)
      }

      return await cursor.toArray();
    },

    allOracles: async (root, {filter, first, skip, orderBy}, {mongo: {Oracles}}) => {
      return await Oracles.find({}).toArray();
    },

    allVotes: async (root, {filter, first, skip, orderBy}, {mongo: {Votes}}) => {
      return await Votes.find({}).toArray();
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
      const response = await Oracles.insert(data);
      return Object.assign({id: response.insertedIds[0]}, data);
    },

    createVote: async (root, data, {mongo: {Votes}}) => {
      const response = await Votes.insert(data);
      return Object.assign({id: response.insertedIds[0]}, data);
    }
  },

  Topic: {
    oracles: async ({topicAddress}, data, {mongo: {Oracles}}) => {
      return await Oracles.find({topicAddress: topicAddress}).toArray();
    }
  },

  Subscription: {
    Topic: {
      subscribe: () => pubsub.asyncIterator('Topic'),
    },
  },
};