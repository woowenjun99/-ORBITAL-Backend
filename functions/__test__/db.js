/**
 * Link: https://javascript.plainenglish.io/unit-testing-node-js-mongoose-using-jest-106a39b8393d
 */
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

exports.connect = async () => {
  const mongoOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 10,
  };
  await MongoMemoryServer.create(mongoOpts);
};

exports.closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
};

exports.clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
};
