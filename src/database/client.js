var MongoClient = require('mongodb').MongoClient;

const URL = process.env.DB_URL;

const client = new MongoClient(URL);

function connect(databaseName) {
  const db = client.db(databaseName);
}

function disconnect() {
  client.close();
}

module.exports = {
  connect,
  disconnect,
};
