import mongoose from 'mongoose';
import { inMemoryStore, isUsingMemoryDb } from '../db.js';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  isGuest: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const MongooseUser = mongoose.model('User', userSchema);

export const UserModel = {
  async findOne({ email, id }) {
    if (isUsingMemoryDb) {
      if (email) {
        for (const user of inMemoryStore.users.values()) {
          if (user.email === email) return user;
        }
      }
      if (id) {
        return inMemoryStore.users.get(id) || null;
      }
      return null;
    }
    if (email) return MongooseUser.findOne({ email });
    if (id) return MongooseUser.findById(id);
    return null;
  },

  async findById(id) {
    if (isUsingMemoryDb) {
      return inMemoryStore.users.get(id) || null;
    }
    return MongooseUser.findById(id);
  },

  async create(userData) {
    if (isUsingMemoryDb) {
      const id = inMemoryStore.generateId();
      const newUser = {
        _id: id,
        id: id,
        ...userData,
        createdAt: new Date().toISOString()
      };
      inMemoryStore.users.set(id, newUser);
      return newUser;
    }
    return MongooseUser.create(userData);
  }
};

