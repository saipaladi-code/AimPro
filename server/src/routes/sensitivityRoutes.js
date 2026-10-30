import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { generateSensitivityRecommendation } from '../engine/sensitivityEngine.js';
import { SensitivityConfigModel } from '../models/SensitivityConfig.js';
import { AdjustmentAuditModel } from '../models/AdjustmentAudit.js';

const router = express.Router();

// Generate sensitivity recommendation (public/guest or authenticated)
router.post('/recommend', (req, res) => {
  try {
    const { game, device, preferences } = req.body;
    if (!game) {
      return res.status(400).json({ error: 'Game selection is required' });
    }
    const recommendation = generateSensitivityRecommendation({ game, device, preferences });
    return res.json(recommendation);
  } catch (err) {
    console.error('Recommendation generation error:', err);
    res.status(500).json({ error: 'Failed to generate sensitivity recommendations' });
  }
});

// Get user configs
router.get('/configs', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const configs = await SensitivityConfigModel.findByUser(userId);
    res.json({ configs });
  } catch (err) {
    console.error('Fetch configs error:', err);
    res.status(500).json({ error: 'Failed to load saved configurations' });
  }
});

// Save new config
router.post('/save', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { title, game, device, preferences, settings, confidence, rationale } = req.body;

    if (!game || !settings) {
      return res.status(400).json({ error: 'Game and settings are required' });
    }

    const newConfig = await SensitivityConfigModel.create({
      userId,
      title: title || `${game.toUpperCase()} Custom Sensitivity`,
      game,
      device: device || {},
      preferences: preferences || {},
      settings,
      confidence: confidence || 'Customized by Player',
      rationale: rationale || []
    });

    res.status(201).json({
      message: 'Configuration saved successfully',
      config: newConfig
    });
  } catch (err) {
    console.error('Save config error:', err);
    res.status(500).json({ error: 'Failed to save configuration' });
  }
});

// Update existing config
router.put('/configs/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, settings, rationale, confidence } = req.body;

    const updated = await SensitivityConfigModel.updateById(id, {
      title,
      settings,
      rationale,
      confidence
    });

    if (!updated) {
      return res.status(404).json({ error: 'Configuration not found' });
    }

    res.json({ message: 'Configuration updated', config: updated });
  } catch (err) {
    console.error('Update config error:', err);
    res.status(500).json({ error: 'Failed to update configuration' });
  }
});

// Delete config
router.delete('/configs/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await SensitivityConfigModel.deleteById(id);
    res.json({ message: 'Configuration deleted' });
  } catch (err) {
    console.error('Delete config error:', err);
    res.status(500).json({ error: 'Failed to delete configuration' });
  }
});

// Apply sensitivity adjustment
router.post('/apply-adjustment', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const {
      configId,
      category,
      settingKey,
      settingLabel,
      previousValue,
      newValue,
      changePercent,
      reason,
      evidence,
      relatedTestId
    } = req.body;

    if (!configId || !category || !settingKey || newValue === undefined) {
      return res.status(400).json({ error: 'Missing required adjustment parameters' });
    }

    // Retrieve config
    const config = await SensitivityConfigModel.findById(configId);
    if (!config) {
      return res.status(404).json({ error: 'Referenced configuration not found' });
    }

    // Update the specific value
    const updatedSettings = JSON.parse(JSON.stringify(config.settings));
    if (!updatedSettings[category]) {
      updatedSettings[category] = {};
    }
    updatedSettings[category][settingKey] = Number(newValue);

    const updatedConfig = await SensitivityConfigModel.updateById(configId, {
      settings: updatedSettings
    });

    // Write audit record
    const audit = await AdjustmentAuditModel.create({
      userId,
      configId,
      category,
      settingKey,
      settingLabel: settingLabel || settingKey,
      previousValue: Number(previousValue),
      newValue: Number(newValue),
      changePercent: Number(changePercent),
      reason,
      evidence,
      relatedTestId
    });

    res.json({
      message: 'Adjustment applied successfully',
      config: updatedConfig,
      audit
    });
  } catch (err) {
    console.error('Apply adjustment error:', err);
    res.status(500).json({ error: 'Failed to apply adjustment' });
  }
});

// Undo sensitivity adjustment
router.post('/undo-adjustment/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const audit = await AdjustmentAuditModel.findById(id);

    if (!audit) {
      return res.status(404).json({ error: 'Audit record not found' });
    }

    if (audit.undone) {
      return res.status(400).json({ error: 'Adjustment has already been reverted' });
    }

    const config = await SensitivityConfigModel.findById(audit.configId);
    if (!config) {
      return res.status(404).json({ error: 'Target configuration not found' });
    }

    // Restore previous value
    const restoredSettings = JSON.parse(JSON.stringify(config.settings));
    if (restoredSettings[audit.category]) {
      restoredSettings[audit.category][audit.settingKey] = audit.previousValue;
    }

    const updatedConfig = await SensitivityConfigModel.updateById(audit.configId, {
      settings: restoredSettings
    });

    await AdjustmentAuditModel.updateById(id, { undone: true });

    res.json({
      message: 'Adjustment successfully undone',
      config: updatedConfig,
      restoredValue: audit.previousValue
    });
  } catch (err) {
    console.error('Undo adjustment error:', err);
    res.status(500).json({ error: 'Failed to revert adjustment' });
  }
});

// Get audit logs
router.get('/audits', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const audits = await AdjustmentAuditModel.findByUser(userId);
    res.json({ audits });
  } catch (err) {
    console.error('Get audits error:', err);
    res.status(500).json({ error: 'Failed to retrieve adjustment audit history' });
  }
});

export default router;

