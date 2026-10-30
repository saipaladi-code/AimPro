import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDB } from './db.js';
import authRoutes from './routes/authRoutes.js';
import sensitivityRoutes from './routes/sensitivityRoutes.js';
import aimTestRoutes from './routes/aimTestRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB or memory store
connectDB();

// Middleware
app.use(cors({
  origin: true, // Allow frontend dev server
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/sensitivity', sensitivityRoutes);
app.use('/api/aim-test', aimTestRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'AimPro API Engine',
    timestamp: new Date().toISOString()
  });
});

// Root friendly response
app.get('/', (req, res) => {
  res.send('AimPro API Server is active. Access endpoints under /api/*');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Internal server error occurred' });
});

app.listen(PORT, () => {
  console.log(`🎮 AimPro API server is running on http://localhost:${PORT}`);
});

