import { MongoClient, Db } from "mongodb";

const MONGODB_URI = process.env.DATABASE_URL || "mongodb://localhost:27017/travel";
const MONGODB_DB_NAME = "travel";

if (!MONGODB_URI) {
  throw new Error("Please define DATABASE_URL in your environment variables");
}

interface GlobalMongo {
  mongoClient: MongoClient | undefined;
  promise: Promise<MongoClient> | undefined;
}

const globalForMongo = globalThis as unknown as GlobalMongo;

async function connectToDatabase(): Promise<MongoClient> {
  // Return existing connected client
  if (globalForMongo.mongoClient) {
    return globalForMongo.mongoClient;
  }

  // Create new connection if not exists
  if (!globalForMongo.promise) {
    const client = new MongoClient(MONGODB_URI);
    globalForMongo.promise = client.connect().then((connectedClient) => {
      globalForMongo.mongoClient = connectedClient;
      return connectedClient;
    });
  }

  return globalForMongo.promise;
}

// Wrapper to maintain backward compatibility with routes using client.connect() and client.close()
class MongoDBClient {
  async connect(): Promise<MongoClient> {
    return connectToDatabase();
  }

  async close(): Promise<void> {
    // Don't actually close - keep connection alive for reuse
    // This prevents "Client must be connected" errors
    return;
  }

  async db(name?: string): Promise<Db> {
    const client = await connectToDatabase();
    return client.db(name || MONGODB_DB_NAME);
  }

  // Promise-like behavior for backward compatibility
  then<TResult1 = MongoClient, TResult2 = never>(
    onfulfilled?: ((value: MongoClient) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return connectToDatabase().then(onfulfilled, onrejected);
  }

  catch<TResult = never>(
    onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null
  ): Promise<MongoClient | TResult> {
    return connectToDatabase().catch(onrejected);
  }

  finally(onfinally?: (() => void) | null): Promise<MongoClient> {
    return connectToDatabase().finally(onfinally);
  }
}

// Export default as client wrapper for backward compatibility
const client = new MongoDBClient();
export default client;

// Export getDb - the recommended way to get database
export async function getDb(): Promise<Db> {
  const mongoClient = await connectToDatabase();
  return mongoClient.db(MONGODB_DB_NAME);
}

// Export getClient for direct MongoClient access
export async function getClient(): Promise<MongoClient> {
  return connectToDatabase();
}
