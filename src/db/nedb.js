const path = require('path');
const datastore = require('nedb-promise');

const topics = datastore({ filename: `${path.dirname(process.argv[0])}/nedb/topics.db`, autoload: true });
const oracles = datastore({ filename: `${path.dirname(process.argv[0])}/nedb/oracles.db`, autoload: true });
const votes = datastore({ filename: `${path.dirname(process.argv[0])}/nedb/votes.db`, autoload: true });
const blocks = datastore({ filename: `${path.dirname(process.argv[0])}/nedb/blocks.db`, autoload: true });

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
