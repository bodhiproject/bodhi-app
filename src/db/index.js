const {Logger, MongoClient} = require('mongodb');

const config = require('../config')

module.exports = async () => {
  const db = await MongoClient.connect(config.MONGO_URL);

  let logCount = 0;
  Logger.setCurrentLogger((msg, stat) => {
    console.log(`MONGO DB REQUEST ${++logCount}: ${msg}`);
  });
  Logger.setLevel('info');
  Logger.filter('class', ['Cursor']);

  return {
    Connection: db,
    Topics: db.collection('topics'),
    Oracles: db.collection('oracles'),
    Votes:  db.collection('votes'),
    Blocks: db.collection('blocks'),
  };
}