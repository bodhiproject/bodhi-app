const { makeExecutableSchema } = require('graphql-tools');
const resolvers = require('./resolvers');

// Define your types here.
const typeDefs = `

type Topic {
  version: Int!
  address: String!
  txid: String!
  status: _OracleStatusType!
  name: String!
  options: [String!]!
  resultIdx: Int
  qtumAmount: [String!]!
  botAmount: [String!]!
  blockNum: Int!
  oracles: [Oracle]!
}

type Oracle {
  version: Int!
  address: String!
  txid: String!
  topicAddress: String!
  resultSetterAddress: String
  resultSetterQAddress: String
  status: _OracleStatusType!
  token: String!
  name: String!
  options: [String!]!
  optionIdxs: [Int!]!
  amounts: [String!]!
  resultIdx: Int
  blockNum: Int!
  startTime: Int!
  endTime: Int!
  resultSetStartTime: Int
  resultSetEndTime: Int
  consensusThreshold: String
}

type Vote {
  version: Int!
  txid: String!
  voterAddress: String!
  voterQAddress: String!
  oracleAddress: String!
  optionIdx: Int!
  amount: String!
  blockNum: Int!
}

type Block {
  blockNum: Int!
  blockTime: Int!
}

type syncInfo {
  syncBlockNum: Int
  chainBlockNum: Int
}

type Query {
  allTopics(filter: TopicFilter, orderBy: [Order!], limit: Int, skip: Int): [Topic]!
  allOracles(filter: OracleFilter, orderBy: [Order!], limit: Int, skip: Int ): [Oracle]!
  searchOracles(searchPhrase: String, orderBy: [Order!], limit: Int, skip: Int): [Oracle]!
  allVotes(filter: VoteFilter, orderBy: [Order!], limit: Int, skip: Int): [Vote]!
  syncInfo: syncInfo!
}

input TopicFilter {
  OR: [TopicFilter!]
  address: String
  status: _OracleStatusType
}

input OracleFilter {
  OR: [OracleFilter!]
  address: String
  topicAddress: String
  resultSetterAddress: String
  resultSetterQAddress: String
  status: _OracleStatusType
  token: _TokenType
}

input VoteFilter {
  OR: [VoteFilter!]
  address: String
  oracleAddress: String
  voterAddress: String
  voterQAddress: String
  optionIdx: Int
}

type Mutation {
  createTopic(
    address: String!
    name: String!
    options: [String!]!
    blockNum: Int
  ): Topic

  createOracle(
    address: String!
    topicAddress: String!
    token: _TokenType!
    optionIdxs: [Int!]!
    blockNum: Int!
    endBlock: Int!
  ): Oracle

  createVote(
    address: String!
    voterAddress: String!
    oracleAddress: String!
    optionIdx: Int!
    amount: Int!
    blockNum: Int!
  ): Vote
}

type Subscription {
  Topic(filter: topicSubscriptionFilter): TopicSubscriptionPayload
}

input topicSubscriptionFilter {
  mutation_in: [_ModelMutationType!]
}

input Order {
  field: String!
  direction: _OrderDirection!
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

enum _OracleStatusType {
  CREATED
  VOTING
  WAITRESULT
  OPENRESULTSET
  PENDING
  WITHDRAW
}

enum _TokenType {
  QTUM
  BOT
}

enum _OrderDirection {
  DESC
  ASC
}
`;

// Generate the schema object from your types definition.
module.exports = makeExecutableSchema({ typeDefs, resolvers });
