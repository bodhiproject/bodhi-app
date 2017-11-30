const pubsub = require('../pubsub');


function buildTopicFilters({OR = [], topicAddress_contains, name_contains}) {
  const filter = (topicAddress_contains || name_contains) ? {} : null;
  if (topicAddress_contains) {
    filter.topicAddress = {$regex: `.*${topicAddress_contains}.*`};
  }
  if (name_contains) {
    filter.name = {$regex: `.*${name_contains}.*`};
  }

  let filters = filter ? [filter] : [];
  for (let i = 0; i < OR.length; i++) {
    filters = filters.concat(buildTopicFilters(OR[i]));
  }
  return filters;
}

module.exports = {
  Query: {
    allTopics: async (root, {filter, first, skip}, {mongo: {Topics}}) => {
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

    allOracles: async (root, data, {mongo: {Oracles}}) => {
      return await Oracles.find({}).toArray();
    },

    allVotes: async (root, data, {mongo: {Votes}}) => {
      return await Votes.find({}).toArray();
    }
  },

  Mutation: {
    createTopic: async (root, data, {mongo: {Topics}}) => {
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
    id: root => root._id || root.id,

    oracles: async ({topicAddress}, data, {mongo: {Oracles}}) => {
      return await Oracles.find({topicAddress: topicAddress}).toArray();
    }
  },

  Oracle: {
    id: root => root._id || root.id,

    votes: async ({oracleAddress}, data, {mongo: {Votes}}) => {
      return await Votes.find({oracleAddress: oracleAddress}).toArray();
    },
  },

  Vote: {
    id: root => root._id || root.id,
  },

  Subscription: {
    Topic: {
      subscribe: () => pubsub.asyncIterator('Topic'),
    },
  },
};