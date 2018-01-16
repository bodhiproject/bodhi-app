const datastore = require('nedb-promise');

const config = require('../config')

topics = datastore({filename: 'topics.db', autoload: true});
oracles = datastore({filename: 'oracles.db', autoload: true});
votes = datastore({filename: 'votes.db', autoload: true});
blocks = datastore({filename: 'blocks.db', autoload: true});

dbPromises = [topics, oracles, votes, blocks]

module.exports = async () => {
  await Promise.all(dbPromises);

  return {
    Topics: topics,
    Oracles: oracles,
    Votes: votes,
    Blocks: blocks
  };
}