import { connect, connection } from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongod;

export const connectDatabase = async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await connect(uri, { dbName: "Testing" });
};

export const closeDatabase = async () => {
  await connection.dropDatabase();
  await connection.close();
  await mongod.stop();
};

export const clearDatabase = async () => {
  const collections = connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
};
