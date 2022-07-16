import { connect, connection } from "mongoose";
import { MongoMemoryReplSet } from "mongodb-memory-server";

let mongod;

export const connectDatabase = async () => {
  mongod = await MongoMemoryReplSet.create();
  const uri = mongod.getUri();
  await connect(uri, { dbName: "Testing" });
  console.log("THE DB STRING IS ", uri);
};

export const closeDatabase = async () => {
  await connection.dropDatabase();
  await connection.close();
  await mongod.stop();
  console.log("CLOSING DATABASE")
};

export const clearDatabase = async () => {
  const collections = connection.collections;
  console.log("CLEARING THE DATABASE NOW")
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
};
