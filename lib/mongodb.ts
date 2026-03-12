import { MongoClient, ObjectId } from 'mongodb';

const MONGODB_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/travel';
const MONGODB_DB_NAME = 'travel';

const globalForMongo = globalThis as unknown as {
  mongoClient: MongoClient | undefined;
};

const client = globalForMongo.mongoClient ?? new MongoClient(MONGODB_URI);

if (process.env.NODE_ENV !== 'production') globalForMongo.mongoClient = client;

export const getDb = () => {
  return client.db(MONGODB_DB_NAME);
};

export default client;
