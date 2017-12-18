const {Logger, MongoClient} = require('mongodb');


const MONGO_URL = 'mongodb://localhost:27017/bodhiapi';

module.exports = async () => {
  const db = await MongoClient.connect(MONGO_URL);

  let logCount = 0;
  Logger.setCurrentLogger((msg, stat) => {
    console.log(`MONGO DB REQUEST ${++logCount}: ${msg}`);
  });
  Logger.setLevel('debug');
  Logger.filter('class', ['Cursor']);

  return {
    Topics: db.collection('topics'),
    Oracles: db.collection('oracles'),
    Votes:  db.collection('votes'),
    Blocks: db.collection('blocks'),
  };
}