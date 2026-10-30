import express from 'express';
import bcrypt from 'bcryptjs';
import { UserModel } from '../models/User.js';
import { signToken, authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await UserModel.create({
      username,
      email,
      password: hashedPassword,
      isGuest: false
    });

    const token = signToken(user);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id: user._id || user.id,
        username: user.username,
        email: user.email,
        isGuest: false
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Failed to create account. Please try again.' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = signToken(user);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id || user.id,
        username: user.username,
        email: user.email,
        isGuest: false
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// Continue as guest
router.post('/guest', async (req, res) => {
  try {
    const guestId = 'guest_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
    const guestUser = {
      id: guestId,
      _id: guestId,
      username: `Guest_${guestId.substring(6, 11).toUpperCase()}`,
      email: `${guestId}@aimpro.local`,
      isGuest: true
    };

    res.cookie('token', guestId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({
      message: 'Started guest session',
      token: guestId,
      user: guestUser
    });
  } catch (err) {
    console.error('Guest session error:', err);
    res.status(500).json({ error: 'Failed to initiate guest session.' });
  }
});

// Get current user profile
router.get('/me', authMiddleware, async (req, res) => {
  res.json({
    user: {
      id: req.user._id || req.user.id,
      username: req.user.username,
      email: req.user.email,
      isGuest: req.user.isGuest || false
    }
  });
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

export default router;

