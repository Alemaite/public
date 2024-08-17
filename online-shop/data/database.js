const { mongoUri } = require("../config/server-config");

const MongoClient = require("mongodb").MongoClient;
const uri = mongoUri;

let database;

async function connectToDb() {
  const client = await MongoClient.connect(uri);
  database = client.db("online-shop");
}

function getDb() {
  if (!database) {
    throw { message: "Database not connected." };
  }
  return database;
}

module.exports = {
  connectToDb: connectToDb,
  getDb: getDb,
};
