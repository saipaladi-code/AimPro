import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'aimpro_secret_key_2026_gamers_secure';

export function signToken(user) {
  return jwt.sign(
    { id: user._id || user.id, email: user.email, username: user.username, isGuest: user.isGuest },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export async function authMiddleware(req, res, next) {
  let token = null;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Handle guest tokens directly or decode JWT
  if (token.startsWith('guest_')) {
    req.user = {
      _id: token,
      id: token,
      username: 'Guest Player',
      email: `${token}@aimpro.local`,
      isGuest: true
    };
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired session token' });
  }
}

