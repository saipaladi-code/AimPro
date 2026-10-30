import mongoose from 'mongoose';

// In-memory fallback database for local execution when MongoDB is not running locally
class InMemoryStore {
  constructor() {
    this.users = new Map();
    this.configs = new Map();
    this.aimTests = new Map();
    this.audits = new Map();
  }

  generateId() {
    return 'mem_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
  }
}

export const inMemoryStore = new InMemoryStore();
export let isUsingMemoryDb = false;

export async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aimpro';
  try {
    mongoose.set('strictQuery', false);
    // Attempt with a short 2.5s timeout so startup doesn't stall if no local mongod
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log('✅ Connected to MongoDB at', uri);
    isUsingMemoryDb = false;
  } catch (err) {
    console.warn('⚠️ MongoDB connection could not be established (' + err.message + ').');
    console.log('🚀 Running with high-performance In-Memory Data Store fallback for local development.');
    isUsingMemoryDb = true;
  }
}

