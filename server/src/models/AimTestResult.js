import mongoose from 'mongoose';
import { inMemoryStore, isUsingMemoryDb } from '../db.js';

const aimTestSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  game: { type: String, default: 'bgmi' },
  duration: { type: Number, default: 30 }, // seconds
  score: { type: Number, required: true },
  accuracy: { type: Number, required: true }, // percentage
  avgReactionTime: { type: Number, required: true }, // ms
  bestReactionTime: { type: Number, required: true }, // ms
  totalSpawned: { type: Number, required: true },
  hits: { type: Number, required: true },
  misses: { type: Number, required: true },
  expired: { type: Number, default: 0 },
  mode: { type: String, default: 'reaction' }, // reaction, precision, speed
  targetBreakdown: [
    {
      targetId: Number,
      reactionTime: Number,
      hit: Boolean,
      size: Number,
      x: Number,
      y: Number
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

const MongooseAimTest = mongoose.model('AimTestResult', aimTestSchema);

export const AimTestResultModel = {
  async findByUser(userId, limit = 50) {
    if (isUsingMemoryDb) {
      const results = [];
      for (const item of inMemoryStore.aimTests.values()) {
        if (item.userId === userId) results.push(item);
      }
      return results
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, limit);
    }
    return MongooseAimTest.find({ userId }).sort({ createdAt: -1 }).limit(limit);
  },

  async findById(id) {
    if (isUsingMemoryDb) {
      return inMemoryStore.aimTests.get(id) || null;
    }
    return MongooseAimTest.findById(id);
  },

  async create(data) {
    if (isUsingMemoryDb) {
      const id = inMemoryStore.generateId();
      const newTest = {
        _id: id,
        id: id,
        ...data,
        createdAt: new Date().toISOString()
      };
      inMemoryStore.aimTests.set(id, newTest);
      return newTest;
    }
    return MongooseAimTest.create(data);
  }
};

