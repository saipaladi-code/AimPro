import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { AimTestResultModel } from '../models/AimTestResult.js';
import { SensitivityConfigModel } from '../models/SensitivityConfig.js';
import { generateAdjustmentsFromTest } from '../engine/adjustmentEngine.js';

const router = express.Router();

// Submit new aim test result
router.post('/results', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const {
      game = 'bgmi',
      duration = 30,
      score = 0,
      accuracy = 0,
      avgReactionTime = 0,
      bestReactionTime = 0,
      totalSpawned = 0,
      hits = 0,
      misses = 0,
      expired = 0,
      mode = 'reaction',
      targetBreakdown = [],
      configId
    } = req.body;

    const testRecord = await AimTestResultModel.create({
      userId,
      game,
      duration,
      score,
      accuracy,
      avgReactionTime,
      bestReactionTime,
      totalSpawned,
      hits,
      misses,
      expired,
      mode,
      targetBreakdown
    });

    // Fetch user history to supply context to recommendation engine
    const history = await AimTestResultModel.findByUser(userId, 10);

    // Retrieve active config if provided or latest
    let activeConfig = null;
    if (configId) {
      activeConfig = await SensitivityConfigModel.findById(configId);
    }
    if (!activeConfig) {
      const userConfigs = await SensitivityConfigModel.findByUser(userId);
      activeConfig = userConfigs.find(c => c.game === game) || userConfigs[0] || null;
    }

    let recommendedAdjustments = [];
    if (activeConfig) {
      recommendedAdjustments = generateAdjustmentsFromTest(activeConfig, testRecord, history);
    }

    res.status(201).json({
      message: 'Aim test result recorded successfully',
      result: testRecord,
      activeConfigId: activeConfig ? (activeConfig._id || activeConfig.id) : null,
      recommendedAdjustments
    });
  } catch (err) {
    console.error('Save test result error:', err);
    res.status(500).json({ error: 'Failed to record test result' });
  }
});

// Get user test history
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const history = await AimTestResultModel.findByUser(userId, 50);

    // Calculate aggregated stats
    const totalTests = history.length;
    let avgAccuracy = 0;
    let avgReaction = 0;
    let bestScore = 0;
    let bestReaction = 9999;

    if (totalTests > 0) {
      let accSum = 0;
      let rxnSum = 0;
      history.forEach(t => {
        accSum += t.accuracy;
        rxnSum += t.avgReactionTime;
        if (t.score > bestScore) bestScore = t.score;
        if (t.bestReactionTime > 0 && t.bestReactionTime < bestReaction) {
          bestReaction = t.bestReactionTime;
        }
      });
      avgAccuracy = Math.round(accSum / totalTests);
      avgReaction = Math.round(rxnSum / totalTests);
    } else {
      bestReaction = 0;
    }

    res.json({
      history,
      stats: {
        totalTests,
        avgAccuracy,
        avgReaction,
        bestScore,
        bestReaction: bestReaction === 9999 ? 0 : bestReaction
      }
    });
  } catch (err) {
    console.error('Fetch test history error:', err);
    res.status(500).json({ error: 'Failed to load test history' });
  }
});

export default router;

