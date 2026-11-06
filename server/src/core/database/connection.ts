import mongoose from 'mongoose';

export interface DatabaseConfig {
  uri: string;
  maxPoolSize?: number;
  serverSelectionTimeoutMS?: number;
}

export async function connectDatabase(config: DatabaseConfig): Promise<typeof mongoose> {
  const options: mongoose.ConnectOptions = {
    maxPoolSize: config.maxPoolSize ?? 20,
    serverSelectionTimeoutMS: config.serverSelectionTimeoutMS ?? 5000,
    autoIndex: true
  };

  try {
    const conn = await mongoose.connect(config.uri, options);
    console.log(`[Database] MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);

    mongoose.connection.on('error', (err) => {
      console.error('[Database] MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[Database] MongoDB disconnected.');
    });

    return conn;
  } catch (error) {
    console.error('[Database] Failed to connect to MongoDB:', error);
    throw error;
  }
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  console.log('[Database] MongoDB connection closed.');
}
