import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const SensitivityContext = createContext();

export const GAME_METADATA = {
  bgmi: {
    id: 'bgmi',
    name: 'Battlegrounds Mobile India (BGMI)',
    shortName: 'BGMI',
    badge: 'Krafton India',
    scaleMax: 400,
    hasSeparateAdsGyro: true,
    categories: ['camera', 'ads', 'gyroscope', 'adsGyroscope']
  },
  pubgm: {
    id: 'pubgm',
    name: 'PUBG Mobile',
    shortName: 'PUBG M',
    badge: 'Tencent Games',
    scaleMax: 400,
    hasSeparateAdsGyro: true,
    categories: ['camera', 'ads', 'gyroscope', 'adsGyroscope']
  },
  freefire: {
    id: 'freefire',
    name: 'Free Fire / FF MAX',
    shortName: 'Free Fire',
    badge: 'Garena',
    scaleMax: 100,
    hasSeparateAdsGyro: false,
    categories: ['general']
  }
};

export const SETTING_LABELS = {
  tppNoScope: 'TPP No Scope',
  fppNoScope: 'FPP No Scope',
  redDot: 'Red Dot / Holographic / Iron Sight',
  scope2x: '2x Scope',
  scope3x: '3x Scope',
  scope4x: '4x Scope / VSS',
  scope6x: '6x Scope',
  scope8x: '8x Scope',
  // Free Fire
  generalLook: 'General (Camera)',
  sniperScope: 'Sniper Scope (AWM/Kar98)',
  freeLook: 'Free Look (360°)'
};

export function SensitivityProvider({ children }) {
  const { user, token } = useAuth();

  // Onboarding wizard data
  const [onboardingData, setOnboardingData] = useState(() => {
    const saved = localStorage.getItem('aimpro_onboarding');
    return saved ? JSON.parse(saved) : {
      game: 'bgmi',
      device: {
        brand: 'OnePlus',
        model: 'OnePlus 11R',
        ram: '12',
        refreshRate: '120',
        screenSize: '6.7"',
        hasGyro: true
      },
      preferences: {
        playStyle: 'balanced',
        gyroEnabled: true,
        mainProblem: 'recoil',
        experienceLevel: 'intermediate',
        controlStyle: '4-finger',
        weaponCategory: 'ar'
      }
    };
  });

  // Current active configuration
  const [activeConfig, setActiveConfig] = useState(() => {
    const saved = localStorage.getItem('aimpro_active_config');
    return saved ? JSON.parse(saved) : null;
  });

  // Saved configs list
  const [savedConfigs, setSavedConfigs] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Synchronize onboarding state with local storage
  useEffect(() => {
    localStorage.setItem('aimpro_onboarding', JSON.stringify(onboardingData));
  }, [onboardingData]);

  // Synchronize active config with local storage
  useEffect(() => {
    if (activeConfig) {
      localStorage.setItem('aimpro_active_config', JSON.stringify(activeConfig));
    }
  }, [activeConfig]);

  // Fetch saved configs and audits when token changes
  useEffect(() => {
    if (token) {
      loadUserConfigs();
      loadAuditLogs();
    }
  }, [token]);

  const loadUserConfigs = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/sensitivity/configs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSavedConfigs(data.configs || []);
      }
    } catch (e) {
      console.warn('Could not load user configs from server:', e);
    }
  };

  const loadAuditLogs = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/sensitivity/audits', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAuditLogs(data.audits || []);
      }
    } catch (e) {
      console.warn('Could not load audit logs:', e);
    }
  };

  // Generate sensitivity recommendations
  const generateRecommendations = async (params) => {
    setLoading(true);
    const payload = params || onboardingData;

    try {
      const res = await fetch('/api/sensitivity/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        const fullConfig = {
          title: `${data.gameName || payload.game.toUpperCase()} Calibration`,
          game: payload.game,
          device: payload.device,
          preferences: payload.preferences,
          settings: data.settings,
          confidence: data.confidence,
          rationale: data.rationale,
          originalRecommendedSettings: JSON.parse(JSON.stringify(data.settings)),
          createdAt: new Date().toISOString()
        };
        setActiveConfig(fullConfig);
        setLoading(false);
        return fullConfig;
      }
    } catch (err) {
      console.warn('Backend call failed, using fallback client generator:', err);
    }

    // Client-side fallback if backend route fails
    const fallbackConfig = {
      title: `${payload.game.toUpperCase()} Initial Configuration`,
      game: payload.game,
      device: payload.device,
      preferences: payload.preferences,
      settings: payload.game === 'freefire' ? {
        general: {
          generalLook: 94,
          redDot: 88,
          scope2x: 80,
          scope4x: 74,
          sniperScope: 55,
          freeLook: 70
        }
      } : {
        camera: { tppNoScope: 125, fppNoScope: 120, redDot: 60, scope2x: 42, scope3x: 32, scope4x: 24, scope6x: 18, scope8x: 12 },
        ads: { tppNoScope: 125, fppNoScope: 120, redDot: 65, scope2x: 44, scope3x: 34, scope4x: 26, scope6x: 20, scope8x: 14 },
        gyroscope: { tppNoScope: 340, fppNoScope: 340, redDot: 320, scope2x: 300, scope3x: 240, scope4x: 200, scope6x: 135, scope8x: 85 },
        adsGyroscope: { tppNoScope: 340, fppNoScope: 340, redDot: 330, scope2x: 310, scope3x: 250, scope4x: 210, scope6x: 140, scope8x: 90 },
      },
      confidence: 'Provisional Starting Recommendation',
      rationale: ['Calibrated based on device profile and baseline touch response.'],
      originalRecommendedSettings: null,
      createdAt: new Date().toISOString()
    };
    setActiveConfig(fallbackConfig);
    setLoading(false);
    return fallbackConfig;
  };

  // Update a single setting value
  const updateSettingValue = (category, key, value) => {
    if (!activeConfig) return;
    const game = activeConfig.game || 'bgmi';
    const max = GAME_METADATA[game]?.scaleMax || 400;
    const clamped = Math.min(Math.max(Number(value) || 0, 0), max);

    const updated = {
      ...activeConfig,
      settings: {
        ...activeConfig.settings,
        [category]: {
          ...activeConfig.settings[category],
          [key]: clamped
        }
      }
    };
    setActiveConfig(updated);
  };

  // Reset to original recommended values
  const resetToRecommended = () => {
    if (!activeConfig || !activeConfig.originalRecommendedSettings) return;
    setActiveConfig(prev => ({
      ...prev,
      settings: JSON.parse(JSON.stringify(prev.originalRecommendedSettings))
    }));
  };

  // Save configuration
  const saveConfiguration = async (customTitle) => {
    if (!activeConfig) return null;
    const payload = {
      ...activeConfig,
      title: customTitle || activeConfig.title || 'AimPro Profile'
    };

    if (token) {
      try {
        const res = await fetch('/api/sensitivity/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const data = await res.json();
          setActiveConfig(data.config);
          await loadUserConfigs();
          return data.config;
        }
      } catch (e) {
        console.warn('Remote save failed, keeping local:', e);
      }
    }

    // Local save
    const localId = 'local_' + Date.now();
    const saved = { ...payload, _id: localId, id: localId };
    setActiveConfig(saved);
    setSavedConfigs(prev => [saved, ...prev.filter(c => c._id !== localId)]);
    return saved;
  };

  // Apply sensitivity adjustment
  const applyAdjustment = async (adj, relatedTestId) => {
    if (!activeConfig) return false;

    const payload = {
      configId: activeConfig._id || activeConfig.id || 'current',
      category: adj.category,
      settingKey: adj.settingKey,
      settingLabel: adj.settingLabel,
      previousValue: adj.currentValue,
      newValue: adj.suggestedValue,
      changePercent: adj.changePercent,
      reason: adj.reason,
      evidence: adj.evidence,
      relatedTestId
    };

    // Update active config in place immediately
    updateSettingValue(adj.category, adj.settingKey, adj.suggestedValue);

    if (token && (activeConfig._id || activeConfig.id)) {
      try {
        const res = await fetch('/api/sensitivity/apply-adjustment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          await loadAuditLogs();
        }
      } catch (e) {
        console.warn('Could not post audit to server:', e);
      }
    }

    // Add to local audit trail
    const localAudit = {
      _id: 'audit_' + Date.now(),
      ...payload,
      createdAt: new Date().toISOString(),
      undone: false
    };
    setAuditLogs(prev => [localAudit, ...prev]);
    return true;
  };

  // Undo sensitivity adjustment
  const undoAdjustment = async (auditId) => {
    const audit = auditLogs.find(a => a._id === auditId || a.id === auditId);
    if (!audit || audit.undone) return false;

    // Restore value in active configuration
    updateSettingValue(audit.category, audit.settingKey, audit.previousValue);

    if (token) {
      try {
        await fetch(`/api/sensitivity/undo-adjustment/${auditId}`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (e) {}
    }

    setAuditLogs(prev => prev.map(a =>
      (a._id === auditId || a.id === auditId) ? { ...a, undone: true } : a
    ));
    return true;
  };

  // Export settings as JSON or formatted text file
  const exportSettings = (format = 'json') => {
    if (!activeConfig) return;
    let content = '';
    let filename = `aimpro_${activeConfig.game}_sensitivity.${format === 'json' ? 'json' : 'txt'}`;

    if (format === 'json') {
      content = JSON.stringify(activeConfig, null, 2);
    } else {
      content = `=== AimPro Sensitivity Profile ===\n`;
      content += `Game: ${activeConfig.game.toUpperCase()}\n`;
      content += `Date: ${new Date().toLocaleDateString()}\n`;
      content += `Device: ${activeConfig.device?.brand || ''} ${activeConfig.device?.model || ''} (${activeConfig.device?.refreshRate || '90'}Hz)\n`;
      content += `Play Style: ${activeConfig.preferences?.playStyle || 'balanced'}\n\n`;

      Object.entries(activeConfig.settings).forEach(([category, settings]) => {
        content += `[${category.toUpperCase()}]\n`;
        Object.entries(settings).forEach(([key, val]) => {
          content += `  ${SETTING_LABELS[key] || key}: ${val}%\n`;
        });
        content += '\n';
      });
      content += `Disclaimer: These values are calibrated starting recommendations. Test in AimPro Arena to refine.\n`;
    }

    const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Copy formatted settings to clipboard
  const copySettingsToClipboard = async () => {
    if (!activeConfig) return false;
    let text = `🎮 AimPro ${activeConfig.game.toUpperCase()} Sensitivity Code & Configuration\n\n`;

    Object.entries(activeConfig.settings).forEach(([category, settings]) => {
      text += `📍 ${category.toUpperCase()}:\n`;
      Object.entries(settings).forEach(([key, val]) => {
        text += `• ${SETTING_LABELS[key] || key}: ${val}\n`;
      });
      text += '\n';
    });

    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      return false;
    }
  };

  return (
    <SensitivityContext.Provider
      value={{
        onboardingData,
        setOnboardingData,
        activeConfig,
        setActiveConfig,
        savedConfigs,
        auditLogs,
        loading,
        generateRecommendations,
        updateSettingValue,
        resetToRecommended,
        saveConfiguration,
        applyAdjustment,
        undoAdjustment,
        exportSettings,
        copySettingsToClipboard
      }}
    >
      {children}
    </SensitivityContext.Provider>
  );
}

export function useSensitivity() {
  return useContext(SensitivityContext);
}

