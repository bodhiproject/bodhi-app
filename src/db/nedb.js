const datastore = require('nedb-promise');

const topics = datastore({ filename: './nedb/topics.db', autoload: true });
const oracles = datastore({ filename: './nedb/oracles.db', autoload: true });
const votes = datastore({ filename: './nedb/votes.db', autoload: true });
const blocks = datastore({ filename: './nedb/blocks.db', autoload: true });

const dbPromises = [topics, oracles, votes, blocks];

module.exports = async () => {
  try {
    await Promise.all(dbPromises);
  } catch (err) {
    console.error(`DB load Error: ${err.message}`);
    return;
  }

  return {
    Topics: topics,
    Oracles: oracles,
    Votes: votes,
    Blocks: blocks,
  };
};
