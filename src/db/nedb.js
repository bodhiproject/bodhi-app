const datastore = require('nedb-promise');

const config = require('../config')

topics = datastore({filename: __dirname+'/topics.db', autoload: true});
oracles = datastore({filename: __dirname+'/oracles.db', autoload: true});
votes = datastore({filename: __dirname+'/votes.db', autoload: true});
blocks = datastore({filename: __dirname+'/blocks.db', autoload: true});

dbPromises = [topics, oracles, votes, blocks];

module.exports = async () => {
  try{
    await Promise.all(dbPromises);
  }catch(err) {
    console.error(`DB load Error: ${err.message}`);
    return;
  }

  return {
    Topics: topics,
    Oracles: oracles,
    Votes: votes,
    Blocks: blocks
  };
}
