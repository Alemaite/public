const MongoClient = require('mongodb').MongoClient;
const uri = 'mongodb://127.0.0.1:27017';

let database;

async function connectToDb() {
  const client = await MongoClient.connect(uri);
  database = client.db('online-shop');
}

function getDb() {
  if (!database) {
    throw { message: 'Database not connected.' };
  }
  return database;
}

module.exports = {
  connectToDb: connectToDb,
  getDb: getDb,
};
