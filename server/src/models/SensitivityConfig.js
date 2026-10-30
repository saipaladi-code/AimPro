import mongoose from 'mongoose';
import { inMemoryStore, isUsingMemoryDb } from '../db.js';

const configSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, default: 'Custom Configuration' },
  game: { type: String, required: true }, // 'bgmi', 'pubgm', 'freefire'
  device: {
    brand: String,
    model: String,
    ram: String,
    refreshRate: String,
    screenSize: String,
    hasGyro: Boolean
  },
  preferences: {
    playStyle: String, // aggressive, balanced, sniper, casual
    gyroEnabled: Boolean,
    mainProblem: String,
    experienceLevel: String, // beginner, intermediate, advanced
    controlStyle: String, // 2-finger, 3-finger, 4-finger, 5-finger+
    weaponCategory: String // ar, smg, sniper, mixed
  },
  settings: {
    camera: { type: Map, of: Number },
    ads: { type: Map, of: Number },
    gyroscope: { type: Map, of: Number },
    adsGyroscope: { type: Map, of: Number },
    general: { type: Map, of: Number } // For Free Fire (General, Red Dot, 2x, 4x, Sniper, Free Look)
  },
  confidence: { type: String, default: 'Provisional Starting Configuration' },
  rationale: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const MongooseConfig = mongoose.model('SensitivityConfig', configSchema);

export const SensitivityConfigModel = {
  async findByUser(userId) {
    if (isUsingMemoryDb) {
      const results = [];
      for (const item of inMemoryStore.configs.values()) {
        if (item.userId === userId) results.push(item);
      }
      return results.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }
    return MongooseConfig.find({ userId }).sort({ updatedAt: -1 });
  },

  async findById(id) {
    if (isUsingMemoryDb) {
      return inMemoryStore.configs.get(id) || null;
    }
    return MongooseConfig.findById(id);
  },

  async create(data) {
    if (isUsingMemoryDb) {
      const id = inMemoryStore.generateId();
      const newConfig = {
        _id: id,
        id: id,
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      inMemoryStore.configs.set(id, newConfig);
      return newConfig;
    }
    return MongooseConfig.create(data);
  },

  async updateById(id, data) {
    if (isUsingMemoryDb) {
      const existing = inMemoryStore.configs.get(id);
      if (!existing) return null;
      const updated = {
        ...existing,
        ...data,
        updatedAt: new Date().toISOString()
      };
      inMemoryStore.configs.set(id, updated);
      return updated;
    }
    return MongooseConfig.findByIdAndUpdate(id, { ...data, updatedAt: new Date() }, { new: true });
  },

  async deleteById(id) {
    if (isUsingMemoryDb) {
      return inMemoryStore.configs.delete(id);
    }
    return MongooseConfig.findByIdAndDelete(id);
  }
};

