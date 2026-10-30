import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sliders, Save, Download, Copy, RotateCcw, Crosshair, Check,
  Info, AlertTriangle, ShieldCheck, Sparkles, ChevronRight, Edit3, Smartphone
} from 'lucide-react';
import { useSensitivity, SETTING_LABELS, GAME_METADATA } from '../context/SensitivityContext';

export default function SensitivityPage() {
  const navigate = useNavigate();
  const {
    activeConfig,
    updateSettingValue,
    resetToRecommended,
    saveConfiguration,
    exportSettings,
    copySettingsToClipboard,
    generateRecommendations,
    onboardingData
  } = useSensitivity();

  const [activeCategory, setActiveCategory] = useState('camera');
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState(false);
  const [configTitle, setConfigTitle] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  // If no active config exists yet, generate one automatically from onboardingData
  useEffect(() => {
    if (!activeConfig) {
      generateRecommendations(onboardingData);
    } else {
      setConfigTitle(activeConfig.title || 'AimPro Profile');
      // Set default tab based on game
      if (activeConfig.game === 'freefire') {
        setActiveCategory('general');
      } else if (!activeConfig.settings.camera) {
        const firstKey = Object.keys(activeConfig.settings)[0];
        if (firstKey) setActiveCategory(firstKey);
      }
    }
  }, [activeConfig]);

  if (!activeConfig || !activeConfig.settings) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 rounded-full border-4 border-brand-purple border-t-transparent animate-spin mx-auto mb-4" />
        <p className="text-slate-400 font-medium">Synthesizing personalized sensitivity curves...</p>
      </div>
    );
  }

  const game = activeConfig.game || 'bgmi';
  const meta = GAME_METADATA[game] || GAME_METADATA.bgmi;
  const categories = Object.keys(activeConfig.settings);

  // Friendly Category Name
  const getCategoryTitle = (cat) => {
    switch (cat) {
      case 'camera': return 'Camera Sensitivity (Free Look & Standard)';
      case 'ads': return 'ADS Sensitivity (Firing & Recoil Pull-Down)';
      case 'gyroscope': return 'Gyroscope Sensitivity (Tilt Tracking)';
      case 'adsGyroscope': return 'ADS Gyroscope (Firing Recoil Assist)';
      case 'general': return 'Free Fire Aim Sensitivity (0-100)';
      default: return cat.toUpperCase();
    }
  };

  const handleCopy = async () => {
    const success = await copySettingsToClipboard();
    if (success) {
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2500);
    }
  };

  const handleSave = async () => {
    await saveConfiguration(configTitle);
    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-8 animate-fade-in">
      {/* Top Banner & Title */}
      <div className="bg-dark-900 border border-dark-750 rounded-2xl p-6 sm:p-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded bg-brand-purple/20 text-brand-purple-light border border-brand-purple/30">
              {meta.name}
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
              {activeConfig.confidence}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {isEditingTitle ? (
              <input
                type="text"
                value={configTitle}
                onChange={(e) => setConfigTitle(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                autoFocus
                className="font-gaming text-2xl sm:text-3xl font-bold text-white bg-dark-800 border border-brand-purple px-2 py-0.5 rounded-lg focus:outline-none"
              />
            ) : (
              <h1 className="font-gaming text-2xl sm:text-3xl font-bold text-white tracking-wide flex items-center gap-2">
                {configTitle}
                <button
                  onClick={() => setIsEditingTitle(true)}
                  className="text-slate-500 hover:text-slate-300 transition-colors"
                  title="Rename profile"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </h1>
            )}
          </div>

          {/* Hardware & Profile Badges */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
            <span className="flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-brand-cyan" />
              {activeConfig.device?.brand} {activeConfig.device?.model} ({activeConfig.device?.refreshRate || '90 Hz'})
            </span>
            <span>•</span>
            <span className="capitalize text-slate-300">
              {activeConfig.preferences?.playStyle || 'Balanced'} Playstyle
            </span>
            <span>•</span>
            <span className="text-slate-300">
              Gyro: {activeConfig.preferences?.gyroEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>

        {/* Global Action Bar */}
        <div className="flex flex-wrap items-center gap-2.5 sm:self-start">
          <button
            onClick={resetToRecommended}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-dark-850 hover:bg-dark-800 text-slate-300 border border-dark-700 flex items-center gap-1.5 transition-colors"
            title="Reset slider edits back to initial recommendation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-dark-850 hover:bg-dark-800 text-slate-300 border border-dark-700 flex items-center gap-1.5 transition-colors"
          >
            {copyFeedback ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copyFeedback ? 'Copied!' : 'Copy Code'}</span>
          </button>

          <button
            onClick={() => exportSettings('json')}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-dark-850 hover:bg-dark-800 text-slate-300 border border-dark-700 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-dark-800 hover:bg-dark-750 text-white border border-brand-purple/50 shadow-sm flex items-center gap-1.5 transition-colors"
          >
            {saveFeedback ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Save className="w-3.5 h-3.5 text-brand-purple-light" />}
            <span>{saveFeedback ? 'Saved!' : 'Save Profile'}</span>
          </button>

          <Link
            to="/aim-test"
            className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-brand-purple to-brand-cyan text-white shadow-glow-purple hover:opacity-95 flex items-center gap-1.5 transition-all"
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>Test In Arena</span>
          </Link>
        </div>
      </div>

      {/* Main Grid: Settings Sliders on Left, Rationale on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Sensitivity Sliders & Category Tabs */}
        <div className="lg:col-span-8 space-y-6">
          {/* Category Tabs */}
          <div className="flex overflow-x-auto pb-2 border-b border-dark-800 gap-2 scrollbar-none">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${
                    isActive
                      ? 'bg-brand-purple/20 border-brand-purple text-white shadow-glow-purple'
                      : 'bg-dark-900 border-dark-800 text-slate-400 hover:text-slate-200 hover:bg-dark-850'
                  }`}
                >
                  {cat === 'camera' && 'Camera'}
                  {cat === 'ads' && 'ADS Recoil'}
                  {cat === 'gyroscope' && 'Gyroscope'}
                  {cat === 'adsGyroscope' && 'ADS Gyro'}
                  {cat === 'general' && 'General Free Fire'}
                </button>
              );
            })}
          </div>

          {/* Current Category Settings Sliders */}
          <div className="bg-dark-900/90 border border-dark-750 rounded-2xl p-6 sm:p-8 shadow-card space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-dark-800">
              <div>
                <h3 className="font-gaming text-xl font-bold text-white">
                  {getCategoryTitle(activeCategory)}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Adjust values to fine-tune your crosshair velocity and drag resistance.
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-dark-800 text-slate-400 border border-dark-700">
                Range: 0 – {meta.scaleMax}%
              </span>
            </div>

            {/* Sliders Grid */}
            <div className="space-y-5">
              {activeConfig.settings[activeCategory] &&
                Object.entries(activeConfig.settings[activeCategory]).map(([key, value]) => {
                  const label = SETTING_LABELS[key] || key;
                  return (
                    <div key={key} className="bg-dark-850/60 p-4 rounded-xl border border-dark-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-200">{label}</span>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min="0"
                            max={meta.scaleMax}
                            value={value}
                            onChange={(e) => updateSettingValue(activeCategory, key, e.target.value)}
                            className="w-16 bg-dark-950 border border-dark-700 rounded-lg px-2 py-1 text-right font-mono text-sm font-bold text-brand-cyan focus:outline-none focus:border-brand-purple"
                          />
                          <span className="text-xs font-mono text-slate-500">%</span>
                        </div>
                      </div>

                      {/* Range Slider */}
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] text-slate-500 font-mono">0</span>
                        <input
                          type="range"
                          min="0"
                          max={meta.scaleMax}
                          value={value}
                          onChange={(e) => updateSettingValue(activeCategory, key, e.target.value)}
                          className="w-full h-2 bg-dark-950 rounded-lg appearance-none cursor-pointer accent-brand-purple"
                        />
                        <span className="text-[10px] text-slate-500 font-mono">{meta.scaleMax}</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Right Column: Rationale, Confidence & Disclaimer */}
        <div className="lg:col-span-4 space-y-6">
          {/* Recommendation Rationale */}
          <div className="bg-dark-900/90 border border-dark-750 rounded-2xl p-6 shadow-card space-y-4">
            <div className="flex items-center gap-2 text-white">
              <Sparkles className="w-4 h-4 text-brand-purple-light" />
              <h3 className="font-gaming text-lg font-bold tracking-wide">
                CALIBRATION RATIONALE
              </h3>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Why this specific curve was formulated for your hardware profile:
            </p>

            <div className="space-y-3">
              {activeConfig.rationale && activeConfig.rationale.length > 0 ? (
                activeConfig.rationale.map((reason, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-xl bg-dark-850 border border-dark-800 text-xs text-slate-300 leading-relaxed flex items-start gap-2.5"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-cyan mt-1.5 shrink-0" />
                    <span>{reason}</span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400 italic">
                  Calibrated to standard competitive benchmarks.
                </div>
              )}
            </div>
          </div>

          {/* Test in Arena Callout Card */}
          <div className="bg-gradient-to-br from-dark-850 to-dark-900 border border-brand-purple/40 rounded-2xl p-6 shadow-glow-purple space-y-4">
            <div className="w-10 h-10 rounded-xl bg-brand-purple/20 flex items-center justify-center">
              <Crosshair className="w-5 h-5 text-brand-cyan" />
            </div>

            <div>
              <h4 className="font-gaming text-lg font-bold text-white">
                VERIFY IN AIM ARENA
              </h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Take these sensitivity settings for a test drive. The arena measures your flick reaction time, overshooting, and click precision.
              </p>
            </div>

            <Link
              to="/aim-test"
              className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-brand-purple to-brand-purple-hover text-white shadow-glow-purple flex items-center justify-center gap-2 hover:opacity-95 transition-all"
            >
              <span>Launch 30s Aim Test</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mandatory Disclaimer Card */}
          <div className="bg-dark-950/80 border border-amber-500/20 rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Starting Baseline Note</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              "These values are starting recommendations. Actual performance varies by player, game version, control layout, and device. Test and adjust settings to find what works for you."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

