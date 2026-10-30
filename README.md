# AimPro — Professional Mobile Gaming Performance Analyzer & Sensitivity Assistant

AimPro is a full-stack, responsive esports web application designed for competitive mobile gamers (BGMI, PUBG Mobile, and Free Fire / FF MAX). It replaces blind settings copying with personalized starting sensitivity calculations, an interactive in-browser aim testing arena, and data-driven tuning suggestions with undoable audit trails.

---

## 🌟 Key Features

1. **Deterministic Sensitivity Recommendation Engine**:
   - Hardware-aware calibration: Adjusts curves based on screen refresh rate (60 Hz, 90 Hz, 120 Hz, 144 Hz) and device RAM.
   - Game-specific configuration maps:
     - **BGMI & PUBG Mobile**: Camera, ADS, 400% Gyroscope, and ADS Gyroscope across scopes (TPP, FPP, Red Dot, 2x, 3x, 4x, 6x, 8x).
     - **Free Fire / FF MAX**: 0–100 scale calibrator for General Look, Red Dot, 2x Scope, 4x Scope, Sniper Scope, and Free Look.
   - Diagnosed aim corrections: Formulates mathematical offsets for overshooting (-5%), undershooting (+6%), recoil compensation (+10%), or tracking agility (+8%).
   - Export configs to JSON / formatted text, and one-click copy to clipboard.

2. **Interactive Aim-Training Arena (Page 5)**:
   - Dedicated gaming arena with crosshair grid and pulsing targets.
   - Real-time scoring, live HUD counters, and custom Web Audio API sound synthesis (hit chimes, miss thuds, countdown beeps, mute toggle).
   - High-precision timing using `performance.now()`.
   - Outside clicks register as misses; target expiry tracked; prevents accidental page scrolling or double-counting.
   - Multiple drill modes: Reaction Reflex, Precision Small Targets, Speed Blitz.
   - Selectable session durations (15s, 30s, 60s).

3. **Performance Analysis & Diagnostics (Page 6)**:
   - Comprehensive metric cards: Score, Accuracy %, Average Reaction Time (ms), Best Reaction Time (ms), Hits, Misses.
   - Interactive Recharts reaction-time timeline graphs.
   - Actionable calibration advice derived from empirical accuracy and reaction distributions.

4. **Guided Tuning Proposals & Audit Trail (Page 7)**:
   - Proposal cards displaying current value, suggested value, percentage adjustment, reason, and empirical evidence.
   - User-consented application with an undoable audit trail.
   - Full revert/undo capability restoring exact prior values.

5. **Performance Dashboard & Progress Tracking**:
   - Historical trend charts tracking accuracy gains and reaction time reductions across sessions.
   - Saved sensitivity profile manager with instant profile switching and export.

6. **Pro Gaming Guides & Tactical Tutorials**:
   - In-depth articles on gyroscope calibration, vertical recoil pull-down, 60Hz vs 120Hz touch sampling latency, and claw finger layouts.

7. **Authentication & Flexible Guest Mode**:
   - Secure authentication with bcrypt password hashing and JWT cookies.
   - Full-featured **Guest Mode** providing complete functional parity with local storage fallback.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, Recharts, React Router DOM, Web Audio API.
- **Backend**: Node.js, Express.js, REST API architecture.
- **Database**: MongoDB with Mongoose (plus automated In-Memory data store fallback for immediate zero-config local development).
- **Authentication**: JWT tokens, bcrypt password hashing, secure cookie and Authorization header handling.

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js (v18 or newer)
- npm

### 1. Install Dependencies
From the root directory:
```bash
npm run install:all
```
*(Alternatively: `cd server && npm install` followed by `cd client && npm install`)*

### 2. Configure Environment Variables
Copy `.env.example` in `server/`:
```bash
cp server/.env.example server/.env
```
Default configuration:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/aimpro
JWT_SECRET=aimpro_secret_development_key_2026
NODE_ENV=development
```
*Note: If local MongoDB is not running, the backend automatically activates the In-Memory Store so the application runs immediately without requiring a local database daemon.*

### 3. Run Development Servers
From the root directory:
```bash
npm run dev
```
Or run individually in separate terminals:
- **Backend API**: `cd server && npm run dev` (Runs on `http://localhost:5000`)
- **Frontend App**: `cd client && npm run dev` (Runs on `http://localhost:5173`)

Open `http://localhost:5173` in your browser.

---

## 📂 Project Architecture

```
AimPro/
├── client/                     # Frontend React + Vite application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── common/         # DemoModal, etc.
│   │   │   └── layout/         # Navbar, Footer
│   │   ├── context/            # Global state contexts
│   │   │   ├── AuthContext.jsx
│   │   │   ├── SensitivityContext.jsx
│   │   │   └── AimTestContext.jsx
│   │   ├── pages/              # Application pages
│   │   │   ├── HomePage.jsx
│   │   │   ├── OnboardingPage.jsx
│   │   │   ├── SensitivityPage.jsx
│   │   │   ├── AimTestPage.jsx
│   │   │   ├── TestResultsPage.jsx
│   │   │   ├── AdjustmentsPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── GuidesPage.jsx
│   │   │   └── AuthPage.jsx
│   │   ├── utils/
│   │   │   └── audio.js        # Web Audio API sound synthesizer
│   │   ├── App.jsx             # Route definitions
│   │   ├── main.jsx
│   │   └── index.css           # Tailwind + esports styling
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                     # Backend Node.js Express server
│   ├── src/
│   │   ├── db.js               # MongoDB connection + In-Memory fallback
│   │   ├── engine/             # Recommendation & adjustment engines
│   │   │   ├── sensitivityEngine.js
│   │   │   └── adjustmentEngine.js
│   │   ├── middleware/
│   │   │   └── authMiddleware.js
│   │   ├── models/             # Mongoose schemas + In-Memory adapters
│   │   │   ├── User.js
│   │   │   ├── SensitivityConfig.js
│   │   │   ├── AimTestResult.js
│   │   │   └── AdjustmentAudit.js
│   │   ├── routes/             # REST API endpoints
│   │   │   ├── authRoutes.js
│   │   │   ├── sensitivityRoutes.js
│   │   │   └── aimTestRoutes.js
│   │   └── server.js
│   ├── package.json
│   └── .env.example
├── scripts/
│   └── dev.js                  # Concurrent launcher
├── package.json
└── README.md
```

---

## 📊 Deployment Guide

### Frontend (Vercel)
1. Push repository to GitHub.
2. Import `client` directory in Vercel.
3. Set Framework Preset to **Vite**.
4. Set Build Command to `npm run build` and Output Directory to `dist`.
5. Add environment variable `VITE_API_URL` pointing to your deployed backend URL.

### Backend (Railway / Render / Heroku)
1. Deploy `server` directory as a Node.js web service.
2. Set Build Command: `npm install` and Start Command: `node src/server.js`.
3. Provide environment variables:
   - `MONGODB_URI`: Connection string from MongoDB Atlas.
   - `JWT_SECRET`: A secure random cryptographic secret.
   - `NODE_ENV`: `production`.
   - `PORT`: `5000` (or assigned by host).

---

## ⚖️ Disclaimer

These values are starting recommendations. Actual performance varies by player, game version, control layout, and device. Test and adjust settings in the AimPro Arena and your game's training grounds to find what works best for your muscle memory. All game titles, trademarks, and logos belong to their respective copyright holders.

