import { connect, connection } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const mongod = await MongoMemoryServer.create();

export const connectDatabase = async (db_name) => {
  const uri = mongod.getUri();
  await connect(uri, { dbName: db_name });
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
