const { graphqlRestify, graphiqlRestify } = require('apollo-server-restify');
const Router = require('restify-router').Router;

const connectDB = require('../db/nedb');
const schema = require('../schema');

const syncPort = 5555;

const syncRouter = new Router();

const graphQLOptions = async () => ({
  context: { db: await connectDB() },
  schema,
});

syncRouter.get('/graphql', graphqlRestify(graphQLOptions));
syncRouter.post('/graphql', graphqlRestify(graphQLOptions));

syncRouter.get('/graphiql', graphiqlRestify({
  endpointURL: '/graphql',
  subscriptionsEndpoint: `ws://localhost:${syncPort}/subscriptions`,
}));

module.exports = syncRouter;
