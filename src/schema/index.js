const {makeExecutableSchema} = require('graphql-tools');
const resolvers = require('./resolvers');

// Define your types here.
const typeDefs = `
type Topic {
  id: ID!
  topicAddress: String!
  creatorAddress: String!
  name: String!
  options: [String!]!
  resultIdx: Int
  block: Int!
  oracles: [Oracle]!
}

type Oracle {
  id: ID!
  type: String!
  topicAddress: String!
  creatorAddress: String!
  oracleAddress: String!
  optionIdxs: [String!]!
  votes: [Vote]!
  resultIdx: Int
  block: Int!
  endBlock: Int
  arbitrationOptionEndBlock: Int!
}

type Vote {
  id: ID!
  voterAddress: String!
  oracleAddress: String!
  voteForIdx: Int!
  amount: Int!
  block: Int!
}

type Query {
  allTopics(filter: TopicFilter, skip: Int, first: Int): [Topic]!
  allOracles: [Oracle]!
  allVotes: [Vote]!
}

input TopicFilter {
  OR: [TopicFilter!]
  topicAddress_contains: String
  name_contains: String
}

type Mutation {
  createTopic(
    topicAddress: String!
    creatorAddress: String!
    name: String!
    options: [String!]!
  ): Topic

  createOracle(
    type: String!
    topicAddress: String!
    creatorAddress: String!
    oracleAddress: String!
    optionIdxs: [Int!]!
    block: Int!
    endBlock: Int
    arbitrationOptionEndBlock: Int
  ): Oracle

  createVote(
    voterAddress: String!
    oracleAddress: String!
    voteForIdx: Int!
    amount: Int!
    block: Int!
  ): Vote
}

type Subscription {
  Topic(filter: topicSubscriptionFilter): TopicSubscriptionPayload
}

input topicSubscriptionFilter {
  mutation_in: [_ModelMutationType!]
}

type TopicSubscriptionPayload {
  mutation: _ModelMutationType!
  node: Topic
}

enum _ModelMutationType {
  CREATED
  UPDATED
  DELETED
}

`;

// Generate the schema object from your types definition.
module.exports = makeExecutableSchema({typeDefs, resolvers});