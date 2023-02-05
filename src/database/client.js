const configs = require('../configs/run');
const MongoClient = require('mongodb').MongoClient;

configs.runConfigs();

const URL = process.env.DB_URL;

const client = new MongoClient(URL);

async function connect(databaseName) {
  await client.connect();
  const db = client.db(databaseName);
  return db;
}

async function disconnect() {
  client.close();
}

module.exports = {
  connect,
  disconnect,
};
