/**
 * Aim Test Diagnostic & Sensitivity Adjustment Engine
 * Translates measurable in-browser aim performance into data-driven sensitivity tuning suggestions.
 */

export function generateAdjustmentsFromTest(currentConfig, testResult, history = []) {
  if (!currentConfig || !currentConfig.settings) {
    return [];
  }

  const adjustments = [];
  const { accuracy, avgReactionTime, hits, misses, totalSpawned } = testResult;
  const isFreeFire = currentConfig.game === 'freefire';
  const hasGyro = currentConfig.preferences?.gyroEnabled;

  // Evidence baseline calculation
  const totalTests = history.length + 1;
  const confidencePrefix = totalTests >= 3
    ? `Across ${totalTests} recorded sessions`
    : `Based on your latest performance session`;

  // Case 1: Low accuracy / High Miss Count (Likely overshooting or jerky flicks)
  if (accuracy < 60) {
    if (isFreeFire && currentConfig.settings.general) {
      const currentGen = currentConfig.settings.general.generalLook || 90;
      const suggestedGen = Math.max(Math.round(currentGen * 0.95), 10);
      adjustments.push({
        category: 'general',
        settingKey: 'generalLook',
        settingLabel: 'General Sensitivity',
        currentValue: currentGen,
        suggestedValue: suggestedGen,
        changePercent: -5,
        reason: 'Repeated off-target taps indicate cursor over-travel during flick aiming.',
        evidence: `${confidencePrefix}: Accuracy was ${Math.round(accuracy)}% with ${misses} off-target clicks. A small 5% reduction dampens twitch overshoot.`
      });

      const currentRed = currentConfig.settings.general.redDot || 85;
      const suggestedRed = Math.max(Math.round(currentRed * 0.95), 10);
      adjustments.push({
        category: 'general',
        settingKey: 'redDot',
        settingLabel: 'Red Dot Sight',
        currentValue: currentRed,
        suggestedValue: suggestedRed,
        changePercent: -5,
        reason: 'Slight reduction enhances precision on mid-distance targets.',
        evidence: `Miss rate was ${Math.round((misses / Math.max(hits + misses, 1)) * 100)}%. Lowering Red Dot improves micro-flick consistency.`
      });
    } else {
      // PUBG / BGMI
      if (currentConfig.settings.camera) {
        const curRedDotCam = currentConfig.settings.camera.redDot || 60;
        const sugRedDotCam = Math.max(Math.round(curRedDotCam * 0.95), 5);
        adjustments.push({
          category: 'camera',
          settingKey: 'redDot',
          settingLabel: 'Camera Red Dot / Holo',
          currentValue: curRedDotCam,
          suggestedValue: sugRedDotCam,
          changePercent: -5,
          reason: 'Dampen flick overshoot to prevent crosshair slipping past targets.',
          evidence: `${confidencePrefix}: Accuracy registered at ${Math.round(accuracy)}% with ${misses} recorded misses.`
        });
      }

      if (hasGyro && currentConfig.settings.gyroscope) {
        const curGyroRed = currentConfig.settings.gyroscope.redDot || 300;
        const sugGyroRed = Math.max(Math.round(curGyroRed * 0.94), 50);
        adjustments.push({
          category: 'gyroscope',
          settingKey: 'redDot',
          settingLabel: 'Gyroscope Red Dot',
          currentValue: curGyroRed,
          suggestedValue: sugGyroRed,
          changePercent: -6,
          reason: 'Excessive wrist jitter is disrupting reticle centering on rapid targets.',
          evidence: `High dispersion recorded during active engagement. Moderating gyro red dot by 6% increases stabilization.`
        });
      }
    }
  }

  // Case 2: Slow Reaction Time (> 500ms) with Moderate to High Accuracy (Undershooting or over-hesitant)
  else if (avgReactionTime > 500 && accuracy >= 70) {
    if (isFreeFire && currentConfig.settings.general) {
      const currentGen = currentConfig.settings.general.generalLook || 88;
      const suggestedGen = Math.min(Math.round(currentGen * 1.05), 100);
      if (suggestedGen !== currentGen) {
        adjustments.push({
          category: 'general',
          settingKey: 'generalLook',
          settingLabel: 'General Sensitivity',
          currentValue: currentGen,
          suggestedValue: suggestedGen,
          changePercent: +5,
          reason: 'You have high target precision but slower travel time. Increasing sensitivity will speed up target acquisition.',
          evidence: `${confidencePrefix}: High accuracy (${Math.round(accuracy)}%) combined with ${Math.round(avgReactionTime)}ms response time indicates cautious undershooting.`
        });
      }
    } else {
      if (currentConfig.settings.camera) {
        const curTPP = currentConfig.settings.camera.tppNoScope || 120;
        const sugTPP = Math.min(Math.round(curTPP * 1.06), 400);
        adjustments.push({
          category: 'camera',
          settingKey: 'tppNoScope',
          settingLabel: 'TPP No Scope Camera',
          currentValue: curTPP,
          suggestedValue: sugTPP,
          changePercent: +6,
          reason: 'Boost rotation speed so you can acquire targets faster without multiple finger swipes.',
          evidence: `${confidencePrefix}: High accuracy (${Math.round(accuracy)}%) with slower average reaction (${Math.round(avgReactionTime)}ms) indicates your current sensitivity is overly conservative.`
        });
      }
    }
  }

  // Case 3: High Performance / Well Balanced (> 85% Accuracy, < 380ms Reaction)
  else if (accuracy >= 85 && avgReactionTime < 380) {
    if (!isFreeFire && currentConfig.settings.ads) {
      const curRedADS = currentConfig.settings.ads.redDot || 65;
      const sugRedADS = Math.min(Math.round(curRedADS * 1.03), 400);
      adjustments.push({
        category: 'ads',
        settingKey: 'redDot',
        settingLabel: 'ADS Red Dot / Holo',
        currentValue: curRedADS,
        suggestedValue: sugRedADS,
        changePercent: +3,
        reason: 'Your flick fundamentals are exceptionally sharp. A slight 3% bump will enable faster multi-target transfer sprays.',
        evidence: `${confidencePrefix}: Elite performance observed (${Math.round(accuracy)}% accuracy, ${Math.round(avgReactionTime)}ms avg reaction). Fine-tune for esports-grade agility.`
      });
    }
  }

  // Case 4: General Calibration
  if (adjustments.length === 0) {
    if (isFreeFire && currentConfig.settings.general) {
      const currentGen = currentConfig.settings.general.generalLook || 90;
      adjustments.push({
        category: 'general',
        settingKey: 'generalLook',
        settingLabel: 'General Sensitivity',
        currentValue: currentGen,
        suggestedValue: currentGen,
        changePercent: 0,
        reason: 'Settings are well-aligned with your current reaction curve.',
        evidence: `${confidencePrefix}: Performance is balanced (${Math.round(accuracy)}% accuracy, ${Math.round(avgReactionTime)}ms reaction). Retain current values and test again.`
      });
    } else if (currentConfig.settings.camera) {
      const curRed = currentConfig.settings.camera.redDot || 60;
      adjustments.push({
        category: 'camera',
        settingKey: 'redDot',
        settingLabel: 'Camera Red Dot',
        currentValue: curRed,
        suggestedValue: curRed,
        changePercent: 0,
        reason: 'Current sensitivity aligns with your baseline target acquisition.',
        evidence: `${confidencePrefix}: Balanced metrics observed (${Math.round(accuracy)}% accuracy, ${Math.round(avgReactionTime)}ms reaction). Retain current settings.`
      });
    }
  }

  return adjustments;
}

