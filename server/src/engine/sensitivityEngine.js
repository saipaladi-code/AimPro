/**
 * Deterministic Sensitivity Recommendation Engine for AimPro
 * Calculates personalized, game-specific starting configurations based on device,
 * ergonomics, playstyle, and diagnosed aiming challenges.
 */

export const GAME_PROFILES = {
  bgmi: {
    name: 'BGMI (Battlegrounds Mobile India)',
    shortName: 'BGMI',
    maxSensitivity: 400,
    minSensitivity: 1,
    scaleType: 'standard_pubg',
    hasSeparateAdsGyro: true,
  },
  pubgm: {
    name: 'PUBG Mobile',
    shortName: 'PUBG M',
    maxSensitivity: 400,
    minSensitivity: 1,
    scaleType: 'standard_pubg',
    hasSeparateAdsGyro: true,
  },
  freefire: {
    name: 'Free Fire / FF MAX',
    shortName: 'Free Fire',
    maxSensitivity: 100,
    minSensitivity: 0,
    scaleType: 'freefire_100',
    hasSeparateAdsGyro: false,
  }
};

// Base configurations for 90Hz, 8GB RAM, Balanced, Intermediate
const BGMI_BASE = {
  camera: {
    tppNoScope: 125,
    fppNoScope: 120,
    redDot: 60,
    scope2x: 42,
    scope3x: 32,
    scope4x: 24,
    scope6x: 18,
    scope8x: 12,
  },
  ads: {
    tppNoScope: 125,
    fppNoScope: 120,
    redDot: 65,
    scope2x: 44,
    scope3x: 34,
    scope4x: 26,
    scope6x: 20,
    scope8x: 14,
  },
  gyroscope: {
    tppNoScope: 340,
    fppNoScope: 340,
    redDot: 320,
    scope2x: 300,
    scope3x: 240,
    scope4x: 200,
    scope6x: 135,
    scope8x: 85,
  },
  adsGyroscope: {
    tppNoScope: 340,
    fppNoScope: 340,
    redDot: 330,
    scope2x: 310,
    scope3x: 250,
    scope4x: 210,
    scope6x: 140,
    scope8x: 90,
  }
};

const FREEFIRE_BASE = {
  general: {
    generalLook: 94,
    redDot: 88,
    scope2x: 82,
    scope4x: 75,
    sniperScope: 55,
    freeLook: 72,
  }
};

function clamp(val, min, max) {
  return Math.min(Math.max(Math.round(val), min), max);
}

export function generateSensitivityRecommendation(params) {
  const {
    game = 'bgmi',
    device = {},
    preferences = {}
  } = params;

  const gameKey = (game || 'bgmi').toLowerCase();
  const profile = GAME_PROFILES[gameKey] || GAME_PROFILES.bgmi;
  const rationale = [];

  const refreshRate = parseInt(device.refreshRate) || 90;
  const ram = parseInt(device.ram) || 8;
  const playStyle = preferences.playStyle || 'balanced';
  const gyroEnabled = preferences.gyroEnabled ?? true;
  const mainProblem = preferences.mainProblem || 'recoil';
  const experienceLevel = preferences.experienceLevel || 'intermediate';
  const controlStyle = preferences.controlStyle || '4-finger';
  const weaponCategory = preferences.weaponCategory || 'ar';

  if (profile.scaleType === 'freefire_100') {
    return generateFreeFireRecommendation({
      refreshRate,
      ram,
      playStyle,
      gyroEnabled,
      mainProblem,
      experienceLevel,
      controlStyle,
      weaponCategory,
      rationale
    });
  }

  // PUBG / BGMI logic
  let cameraMultiplier = 1.0;
  let adsMultiplier = 1.0;
  let gyroMultiplier = 1.0;
  let sniperMultiplier = 1.0;

  // 1. Display Refresh Rate Adjustments
  if (refreshRate <= 60) {
    cameraMultiplier *= 1.05;
    adsMultiplier *= 1.06;
    rationale.push(`60Hz display response: Added +5-6% camera & ADS sensitivity to offset swipe latency on 60Hz panels.`);
  } else if (refreshRate >= 120) {
    cameraMultiplier *= 0.97;
    adsMultiplier *= 0.96;
    gyroMultiplier *= 1.03;
    rationale.push(`High refresh rate (${refreshRate}Hz): Fine-tuned micro-adjustment precision with 3-4% tighter touch drag and fluid gyro.`);
  } else {
    rationale.push(`Standard 90Hz display: Calibrated against optimal touch sampling intervals.`);
  }

  // 2. RAM & Hardware Stability
  if (ram <= 4) {
    adsMultiplier *= 0.95;
    rationale.push(`4GB device tier: Normalized swipe curves to prevent erratic crosshair jumping during thermal throttling.`);
  }

  // 3. Play Style
  if (playStyle === 'aggressive') {
    cameraMultiplier *= 1.07;
    adsMultiplier *= 1.08;
    gyroMultiplier *= 1.08;
    rationale.push(`Aggressive close-quarters profile: +7-8% responsive target acquisition for quick hip-fire and flick ADS.`);
  } else if (playStyle === 'sniper') {
    sniperMultiplier *= 0.88;
    cameraMultiplier *= 1.03;
    rationale.push(`Sniper specialty: Reduced high-magnification (4x/6x/8x) sensitivity by 12% for pixel-precise headshot holds.`);
  } else if (playStyle === 'casual') {
    cameraMultiplier *= 0.95;
    adsMultiplier *= 0.95;
    gyroMultiplier *= 0.93;
    rationale.push(`Casual ergonomics: Smoother 5% dampening for relaxed, strain-free wrist and thumb movement.`);
  }

  // 4. Main Diagnosed Aiming Problem
  switch (mainProblem) {
    case 'recoil':
    case 'Difficulty controlling recoil':
      adsMultiplier *= 1.10;
      if (gyroEnabled) gyroMultiplier *= 1.08;
      rationale.push(`Recoil compensation: Boosted ADS by +10% ${gyroEnabled ? 'and Gyro ADS by +8%' : ''} so you don't run out of screen space when pulling down.`);
      break;
    case 'overshooting':
    case 'Overshooting targets':
      cameraMultiplier *= 0.93;
      adsMultiplier *= 0.94;
      gyroMultiplier *= 0.94;
      rationale.push(`Overshoot dampening: Decreased sensitivity by 6-7% to eliminate target pass-through during fast flicks.`);
      break;
    case 'undershooting':
    case 'Undershooting targets':
      cameraMultiplier *= 1.07;
      adsMultiplier *= 1.07;
      gyroMultiplier *= 1.06;
      rationale.push(`Undershoot correction: Increased sensitivity by +6-7% to ensure rapid reticle contact with moving targets.`);
      break;
    case 'slow_tracking':
    case 'Slow target tracking':
      cameraMultiplier *= 1.08;
      adsMultiplier *= 1.06;
      rationale.push(`Tracking agility: +8% camera tracking boost to match sprint and vehicle lead-angles.`);
      break;
    case 'close_range':
    case 'Difficulty with close-range fights':
      cameraMultiplier *= 1.08;
      rationale.push(`Close-range agility: Higher TPP/Red Dot sensitivity for agile jiggle and 180° turnarounds.`);
      break;
    case 'long_range':
    case 'Difficulty with long-range aiming':
      sniperMultiplier *= 0.86;
      rationale.push(`Long-range stability: -14% stabilization to 3x, 4x, and 6x scope drift.`);
      break;
    default:
      break;
  }

  // 5. Experience Level
  if (experienceLevel === 'beginner') {
    gyroMultiplier *= 0.78;
    cameraMultiplier *= 0.96;
    adsMultiplier *= 0.96;
    rationale.push(`Beginner learning curve: Moderated gyro baseline to 78% to avoid shaky reticle disorientation while building muscle memory.`);
  } else if (experienceLevel === 'advanced') {
    gyroMultiplier *= 1.06;
    rationale.push(`Competitive/Advanced tier: Max throughput gyroscope tracking for immediate multi-target sprays.`);
  }

  // 6. Control Layout
  if (controlStyle === '2-finger') {
    if (!gyroEnabled) {
      adsMultiplier *= 1.08;
      rationale.push(`2-Finger Thumb layout (No Gyro): Elevated ADS sensitivity to allow single-thumb simultaneous tap & pull-down.`);
    } else {
      gyroMultiplier *= 1.06;
      rationale.push(`2-Finger Thumb layout (Gyro): Leaning on gyroscope for spray pull-down to free right thumb for aiming.`);
    }
  }

  // Construct calibrated settings
  const max = profile.maxSensitivity;
  const min = profile.minSensitivity;

  const camera = {
    tppNoScope: clamp(BGMI_BASE.camera.tppNoScope * cameraMultiplier, min, max),
    fppNoScope: clamp(BGMI_BASE.camera.fppNoScope * cameraMultiplier, min, max),
    redDot: clamp(BGMI_BASE.camera.redDot * cameraMultiplier, min, max),
    scope2x: clamp(BGMI_BASE.camera.scope2x * cameraMultiplier, min, max),
    scope3x: clamp(BGMI_BASE.camera.scope3x * cameraMultiplier * sniperMultiplier, min, max),
    scope4x: clamp(BGMI_BASE.camera.scope4x * cameraMultiplier * sniperMultiplier, min, max),
    scope6x: clamp(BGMI_BASE.camera.scope6x * cameraMultiplier * sniperMultiplier, min, max),
    scope8x: clamp(BGMI_BASE.camera.scope8x * cameraMultiplier * sniperMultiplier, min, max),
  };

  const ads = {
    tppNoScope: clamp(BGMI_BASE.ads.tppNoScope * adsMultiplier, min, max),
    fppNoScope: clamp(BGMI_BASE.ads.fppNoScope * adsMultiplier, min, max),
    redDot: clamp(BGMI_BASE.ads.redDot * adsMultiplier, min, max),
    scope2x: clamp(BGMI_BASE.ads.scope2x * adsMultiplier, min, max),
    scope3x: clamp(BGMI_BASE.ads.scope3x * adsMultiplier * sniperMultiplier, min, max),
    scope4x: clamp(BGMI_BASE.ads.scope4x * adsMultiplier * sniperMultiplier, min, max),
    scope6x: clamp(BGMI_BASE.ads.scope6x * adsMultiplier * sniperMultiplier, min, max),
    scope8x: clamp(BGMI_BASE.ads.scope8x * adsMultiplier * sniperMultiplier, min, max),
  };

  const gyroscope = gyroEnabled ? {
    tppNoScope: clamp(BGMI_BASE.gyroscope.tppNoScope * gyroMultiplier, min, max),
    fppNoScope: clamp(BGMI_BASE.gyroscope.fppNoScope * gyroMultiplier, min, max),
    redDot: clamp(BGMI_BASE.gyroscope.redDot * gyroMultiplier, min, max),
    scope2x: clamp(BGMI_BASE.gyroscope.scope2x * gyroMultiplier, min, max),
    scope3x: clamp(BGMI_BASE.gyroscope.scope3x * gyroMultiplier * sniperMultiplier, min, max),
    scope4x: clamp(BGMI_BASE.gyroscope.scope4x * gyroMultiplier * sniperMultiplier, min, max),
    scope6x: clamp(BGMI_BASE.gyroscope.scope6x * gyroMultiplier * sniperMultiplier, min, max),
    scope8x: clamp(BGMI_BASE.gyroscope.scope8x * gyroMultiplier * sniperMultiplier, min, max),
  } : {
    tppNoScope: 0, fppNoScope: 0, redDot: 0, scope2x: 0, scope3x: 0, scope4x: 0, scope6x: 0, scope8x: 0
  };

  const adsGyroscope = gyroEnabled ? {
    tppNoScope: clamp(BGMI_BASE.adsGyroscope.tppNoScope * gyroMultiplier, min, max),
    fppNoScope: clamp(BGMI_BASE.adsGyroscope.fppNoScope * gyroMultiplier, min, max),
    redDot: clamp(BGMI_BASE.adsGyroscope.redDot * gyroMultiplier, min, max),
    scope2x: clamp(BGMI_BASE.adsGyroscope.scope2x * gyroMultiplier, min, max),
    scope3x: clamp(BGMI_BASE.adsGyroscope.scope3x * gyroMultiplier * sniperMultiplier, min, max),
    scope4x: clamp(BGMI_BASE.adsGyroscope.scope4x * gyroMultiplier * sniperMultiplier, min, max),
    scope6x: clamp(BGMI_BASE.adsGyroscope.scope6x * gyroMultiplier * sniperMultiplier, min, max),
    scope8x: clamp(BGMI_BASE.adsGyroscope.scope8x * gyroMultiplier * sniperMultiplier, min, max),
  } : {
    tppNoScope: 0, fppNoScope: 0, redDot: 0, scope2x: 0, scope3x: 0, scope4x: 0, scope6x: 0, scope8x: 0
  };

  return {
    game: gameKey,
    gameName: profile.name,
    confidence: 'Provisional Starting Recommendation',
    rationale,
    settings: {
      camera,
      ads,
      gyroscope,
      adsGyroscope,
    }
  };
}

function generateFreeFireRecommendation(options) {
  const {
    refreshRate,
    playStyle,
    mainProblem,
    experienceLevel,
    rationale
  } = options;

  let multiplier = 1.0;

  if (refreshRate <= 60) {
    multiplier *= 1.04;
    rationale.push(`60Hz screen: Added +4% to assist quick swipe headshot drag timing.`);
  } else if (refreshRate >= 120) {
    multiplier *= 0.98;
    rationale.push(`120Hz display: Adjusted for ultra-responsive capacitive touch panels.`);
  }

  if (playStyle === 'aggressive') {
    multiplier *= 1.05;
    rationale.push(`Rush/Aggressive play: Enhanced General and Red Dot for one-tap headshot snap.`);
  } else if (playStyle === 'sniper') {
    multiplier *= 0.94;
    rationale.push(`Sniper focus: Balanced general mobility with restrained scope drag.`);
  }

  if (mainProblem === 'overshooting' || mainProblem === 'Overshooting targets') {
    multiplier *= 0.94;
    rationale.push(`Headshot overshooting: Lowered general drag threshold to prevent crosshair floating over targets.`);
  } else if (mainProblem === 'undershooting' || mainProblem === 'Undershooting targets') {
    multiplier *= 1.06;
    rationale.push(`Undershoot correction: Lifted sensitivity for smoother vertical drag contact.`);
  }

  const base = FREEFIRE_BASE.general;
  const general = {
    generalLook: clamp(base.generalLook * multiplier, 0, 100),
    redDot: clamp(base.redDot * multiplier, 0, 100),
    scope2x: clamp(base.scope2x * multiplier, 0, 100),
    scope4x: clamp(base.scope4x * multiplier, 0, 100),
    sniperScope: clamp(base.sniperScope * (playStyle === 'sniper' ? 0.92 : multiplier), 0, 100),
    freeLook: clamp(base.freeLook * multiplier, 0, 100),
  };

  return {
    game: 'freefire',
    gameName: GAME_PROFILES.freefire.name,
    confidence: 'Provisional Starting Recommendation',
    rationale,
    settings: {
      general
    }
  };
}

