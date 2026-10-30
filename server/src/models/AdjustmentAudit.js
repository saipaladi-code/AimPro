import mongoose from 'mongoose';
import { inMemoryStore, isUsingMemoryDb } from '../db.js';

const adjustmentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  configId: { type: String, required: true },
  category: { type: String, required: true }, // camera, ads, gyroscope, adsGyroscope, general
  settingKey: { type: String, required: true }, // e.g., 'redDot', 'tppNoScope'
  settingLabel: { type: String, required: true }, // e.g., 'Red Dot / Holo ADS'
  previousValue: { type: Number, required: true },
  newValue: { type: Number, required: true },
  changePercent: { type: Number, required: true },
  reason: { type: String, required: true },
  evidence: { type: String, required: true },
  relatedTestId: { type: String },
  undone: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const MongooseAdjustment = mongoose.model('AdjustmentAudit', adjustmentSchema);

export const AdjustmentAuditModel = {
  async findByUser(userId, limit = 50) {
    if (isUsingMemoryDb) {
      const results = [];
      for (const item of inMemoryStore.audits.values()) {
        if (item.userId === userId) results.push(item);
      }
      return results
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, limit);
    }
    return MongooseAdjustment.find({ userId }).sort({ createdAt: -1 }).limit(limit);
  },

  async findById(id) {
    if (isUsingMemoryDb) {
      return inMemoryStore.audits.get(id) || null;
    }
    return MongooseAdjustment.findById(id);
  },

  async create(data) {
    if (isUsingMemoryDb) {
      const id = inMemoryStore.generateId();
      const audit = {
        _id: id,
        id: id,
        ...data,
        createdAt: new Date().toISOString()
      };
      inMemoryStore.audits.set(id, audit);
      return audit;
    }
    return MongooseAdjustment.create(data);
  },

  async updateById(id, data) {
    if (isUsingMemoryDb) {
      const existing = inMemoryStore.audits.get(id);
      if (!existing) return null;
      const updated = { ...existing, ...data };
      inMemoryStore.audits.set(id, updated);
      return updated;
    }
    return MongooseAdjustment.findByIdAndUpdate(id, data, { new: true });
  }
};

