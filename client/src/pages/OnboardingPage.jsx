import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Gamepad2, Smartphone, Sliders, CheckCircle2, ChevronRight, ChevronLeft,
  AlertCircle, Sparkles, Shield, Cpu, RefreshCw, Crosshair, Target
} from 'lucide-react';
import { useSensitivity } from '../context/SensitivityContext';

const BRANDS = [
  'OnePlus', 'Samsung', 'iQOO', 'Xiaomi', 'Redmi',
  'Realme', 'Apple', 'Vivo', 'Oppo', 'Asus ROG', 'Other'
];

const RAM_OPTIONS = ['4 GB', '6 GB', '8 GB', '12 GB', '16 GB or more'];
const REFRESH_OPTIONS = ['60 Hz', '90 Hz', '120 Hz', '144 Hz'];
const SCREEN_OPTIONS = ['6.1" or smaller', '6.5" standard', '6.7" large', '6.8"+ flagship'];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { onboardingData, setOnboardingData, generateRecommendations, loading } = useSensitivity();

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});

  // Form State
  const [game, setGame] = useState(onboardingData.game || 'bgmi');
  const [device, setDevice] = useState(onboardingData.device || {
    brand: 'OnePlus',
    model: 'OnePlus 11R',
    ram: '12 GB',
    refreshRate: '120 Hz',
    screenSize: '6.7" large',
    hasGyro: true
  });
  const [preferences, setPreferences] = useState(onboardingData.preferences || {
    playStyle: 'balanced',
    gyroEnabled: true,
    mainProblem: 'Difficulty controlling recoil',
    experienceLevel: 'intermediate',
    controlStyle: '4-finger',
    weaponCategory: 'Assault rifles'
  });

  // Step 1 Validation
  const validateStep1 = () => {
    const errs = {};
    if (!game) errs.game = 'Please select a game.';
    if (!device.brand) errs.brand = 'Please select your mobile brand.';
    if (!device.model || device.model.trim() === '') errs.model = 'Please enter your phone model.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 2 Validation
  const validateStep2 = () => {
    const errs = {};
    if (!preferences.playStyle) errs.playStyle = 'Please select your playing style.';
    if (!preferences.mainProblem) errs.mainProblem = 'Please specify your primary aiming problem.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1) {
      if (validateStep1()) {
        setOnboardingData(prev => ({ ...prev, game, device }));
        setStep(2);
      }
    } else if (step === 2) {
      if (validateStep2()) {
        setOnboardingData(prev => ({ ...prev, preferences }));
        setStep(3);
      }
    }
  };

  const handleBack = () => {
    setErrors({});
    if (step > 1) setStep(step - 1);
  };

  const handleGenerate = async () => {
    const finalPayload = { game, device, preferences };
    setOnboardingData(finalPayload);
    await generateRecommendations(finalPayload);
    navigate('/sensitivity');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:py-16">
      {/* Wizard Progress Indicator */}
      <div className="mb-10">
        <div className="flex items-center justify-between max-w-lg mx-auto relative">
          {/* Connector Line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-dark-800 -translate-y-1/2 z-0" />
          <div
            className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-brand-purple to-brand-cyan -translate-y-1/2 z-0 transition-all duration-300"
            style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
          />

          {[
            { num: 1, label: 'Game & Hardware' },
            { num: 2, label: 'Playstyle & Ergonomics' },
            { num: 3, label: 'Review & Calibrate' }
          ].map((item) => {
            const isCompleted = step > item.num;
            const isCurrent = step === item.num;
            return (
              <div key={item.num} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    isCompleted
                      ? 'bg-emerald-500 text-dark-950 font-bold shadow-md'
                      : isCurrent
                      ? 'bg-gradient-to-tr from-brand-purple to-brand-cyan text-white shadow-glow-purple ring-4 ring-brand-purple/20'
                      : 'bg-dark-850 text-slate-500 border border-dark-700'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : item.num}
                </div>
                <span className={`text-[11px] font-semibold mt-2 tracking-wide uppercase ${isCurrent ? 'text-white' : 'text-slate-500'}`}>
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP 1: Game & Device Selection */}
      {step === 1 && (
        <div className="bg-dark-900/90 border border-dark-750 rounded-2xl p-6 sm:p-8 shadow-card space-y-8 animate-fade-in">
          <div>
            <h2 className="font-gaming text-2xl sm:text-3xl font-bold text-white tracking-wide">
              STEP 1: SELECT YOUR GAME & DEVICE
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Choose your competitive title and mobile hardware specifications to establish baseline touch drag multipliers.
            </p>
          </div>

          {/* Game Selection Cards */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
              Target Game
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { id: 'bgmi', name: 'BGMI', sub: 'Battlegrounds Mobile India', badge: 'v3.5' },
                { id: 'pubgm', name: 'PUBG Mobile', sub: 'Global Version', badge: 'Esports' },
                { id: 'freefire', name: 'Free Fire', sub: 'Garena FF MAX', badge: 'OB48' }
              ].map((g) => {
                const isSelected = game === g.id;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setGame(g.id)}
                    className={`relative p-5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-brand-purple/15 border-brand-purple shadow-glow-purple text-white'
                        : 'bg-dark-850 border-dark-700/80 text-slate-300 hover:border-dark-600 hover:bg-dark-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Gamepad2 className={`w-6 h-6 ${isSelected ? 'text-brand-cyan' : 'text-slate-500'}`} />
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-dark-800 text-slate-400 border border-dark-700">
                        {g.badge}
                      </span>
                    </div>
                    <div className="font-gaming text-xl font-bold">{g.name}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{g.sub}</div>
                  </button>
                );
              })}
            </div>
            {errors.game && <p className="text-xs text-red-400 mt-2 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.game}</p>}
          </div>

          {/* Hardware Specs Form */}
          <div className="space-y-6 pt-4 border-t border-dark-800">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-brand-cyan" />
              Device Hardware Profile
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Brand */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Mobile Brand</label>
                <select
                  value={device.brand}
                  onChange={(e) => setDevice({ ...device, brand: e.target.value })}
                  className="w-full bg-dark-850 border border-dark-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-purple"
                >
                  {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              {/* Model */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Device Model</label>
                <input
                  type="text"
                  placeholder="e.g., iPhone 15 Pro, S24 Ultra, iQOO Neo 9"
                  value={device.model}
                  onChange={(e) => setDevice({ ...device, model: e.target.value })}
                  className="w-full bg-dark-850 border border-dark-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-purple placeholder-slate-500"
                />
                {errors.model && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.model}</p>}
              </div>

              {/* RAM */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">RAM Capacity</label>
                <select
                  value={device.ram}
                  onChange={(e) => setDevice({ ...device, ram: e.target.value })}
                  className="w-full bg-dark-850 border border-dark-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-purple"
                >
                  {RAM_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              {/* Refresh Rate */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Display Refresh Rate</label>
                <select
                  value={device.refreshRate}
                  onChange={(e) => setDevice({ ...device, refreshRate: e.target.value })}
                  className="w-full bg-dark-850 border border-dark-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-purple"
                >
                  {REFRESH_OPTIONS.map(rf => <option key={rf} value={rf}>{rf}</option>)}
                </select>
                <span className="text-[11px] text-slate-500 mt-1 block">Higher refresh rates enable tighter micro-adjustment curves.</span>
              </div>

              {/* Screen Size */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Screen Dimension</label>
                <select
                  value={device.screenSize}
                  onChange={(e) => setDevice({ ...device, screenSize: e.target.value })}
                  className="w-full bg-dark-850 border border-dark-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-purple"
                >
                  {SCREEN_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Gyroscope Hardware */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Hardware Gyroscope Sensor</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDevice({ ...device, hasGyro: true })}
                    className={`py-2.5 rounded-lg text-xs font-semibold border transition-all ${
                      device.hasGyro
                        ? 'bg-brand-purple/20 border-brand-purple text-white shadow-sm'
                        : 'bg-dark-850 border-dark-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    Sensor Present
                  </button>
                  <button
                    type="button"
                    onClick={() => setDevice({ ...device, hasGyro: false })}
                    className={`py-2.5 rounded-lg text-xs font-semibold border transition-all ${
                      !device.hasGyro
                        ? 'bg-brand-purple/20 border-brand-purple text-white shadow-sm'
                        : 'bg-dark-850 border-dark-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    No Gyroscope
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-end pt-4 border-t border-dark-800">
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-brand-purple to-brand-purple-hover shadow-glow-purple flex items-center gap-2 hover:opacity-95 transition-all"
            >
              <span>Next: Playing Style</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Playing Style & Preferences */}
      {step === 2 && (
        <div className="bg-dark-900/90 border border-dark-750 rounded-2xl p-6 sm:p-8 shadow-card space-y-8 animate-fade-in">
          <div>
            <h2 className="font-gaming text-2xl sm:text-3xl font-bold text-white tracking-wide">
              STEP 2: PLAYING STYLE & AIMING DIAGNOSTICS
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Select your combat posture, control ergonomics, and current aiming friction points.
            </p>
          </div>

          {/* Playing Style Cards */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
              Primary Combat Playstyle
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { id: 'aggressive', title: 'Aggressive', desc: 'Close-quarters entry fragger, rapid 180° sweeps.' },
                { id: 'balanced', title: 'Balanced', desc: 'Versatile mid-range flex player, disciplined sprays.' },
                { id: 'sniper', title: 'Sniper Focus', desc: 'Long-range bolt action precision and micro-tracking.' },
                { id: 'casual', title: 'Casual', desc: 'Comfortable, lower-fatigue wrist movements.' }
              ].map((style) => {
                const isSelected = preferences.playStyle === style.id;
                return (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setPreferences({ ...preferences, playStyle: style.id })}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-brand-purple/20 border-brand-purple shadow-glow-purple text-white'
                        : 'bg-dark-850 border-dark-700/80 text-slate-300 hover:border-dark-600 hover:bg-dark-800'
                    }`}
                  >
                    <div className="font-gaming text-lg font-bold mb-1">{style.title}</div>
                    <div className="text-xs text-slate-400 leading-snug">{style.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Additional Preferences Form */}
          <div className="space-y-6 pt-4 border-t border-dark-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Gyroscope Usage */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Gyroscope In-Game Status
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPreferences({ ...preferences, gyroEnabled: true })}
                    className={`py-2.5 rounded-lg text-xs font-semibold border transition-all ${
                      preferences.gyroEnabled
                        ? 'bg-brand-cyan/20 border-brand-cyan text-white shadow-glow-cyan'
                        : 'bg-dark-850 border-dark-700 text-slate-400'
                    }`}
                  >
                    Enabled (Always On)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreferences({ ...preferences, gyroEnabled: false })}
                    className={`py-2.5 rounded-lg text-xs font-semibold border transition-all ${
                      !preferences.gyroEnabled
                        ? 'bg-brand-cyan/20 border-brand-cyan text-white shadow-glow-cyan'
                        : 'bg-dark-850 border-dark-700 text-slate-400'
                    }`}
                  >
                    Disabled (Thumb Only)
                  </button>
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Experience Tier
                </label>
                <select
                  value={preferences.experienceLevel}
                  onChange={(e) => setPreferences({ ...preferences, experienceLevel: e.target.value })}
                  className="w-full bg-dark-850 border border-dark-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-purple"
                >
                  <option value="beginner">Beginner (Lower sensitivity, stable learning curve)</option>
                  <option value="intermediate">Intermediate (Balanced competitive baseline)</option>
                  <option value="advanced">Advanced / Esports (High agility & fast flick transfer)</option>
                </select>
              </div>

              {/* Main Problem */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  What is your primary aiming difficulty?
                </label>
                <select
                  value={preferences.mainProblem}
                  onChange={(e) => setPreferences({ ...preferences, mainProblem: e.target.value })}
                  className="w-full bg-dark-850 border border-dark-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-purple"
                >
                  <option value="Difficulty controlling recoil">Difficulty controlling vertical recoil (screen runs out)</option>
                  <option value="Overshooting targets">Overshooting targets (flicks fly past enemy)</option>
                  <option value="Undershooting targets">Undershooting targets (swipes fall short of target)</option>
                  <option value="Slow target tracking">Slow target tracking (cannot keep up with sprinting enemies)</option>
                  <option value="Difficulty with close-range fights">Difficulty with close-range fights (hip-fire jiggle)</option>
                  <option value="Difficulty with long-range aiming">Difficulty with long-range aiming (scope reticle shakes)</option>
                  <option value="Inconsistent aim">Inconsistent aim (day-to-day variance)</option>
                </select>
              </div>

              {/* Control Claw Layout */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Finger Claw Layout
                </label>
                <select
                  value={preferences.controlStyle}
                  onChange={(e) => setPreferences({ ...preferences, controlStyle: e.target.value })}
                  className="w-full bg-dark-850 border border-dark-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-purple"
                >
                  <option value="2-finger">2-Finger (Traditional Thumbs)</option>
                  <option value="3-finger">3-Finger Claw</option>
                  <option value="4-finger">4-Finger Claw (Esports Standard)</option>
                  <option value="5-finger">5-Finger or more (Tablet / Flagship Claw)</option>
                </select>
              </div>

              {/* Preferred Weapon Class */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Primary Weapon Specialty
                </label>
                <select
                  value={preferences.weaponCategory}
                  onChange={(e) => setPreferences({ ...preferences, weaponCategory: e.target.value })}
                  className="w-full bg-dark-850 border border-dark-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-purple"
                >
                  <option value="Assault rifles">Assault Rifles (M416, AKM, Scar-L, Groza)</option>
                  <option value="SMGs">SMGs (UMP45, Vector, Thompson, MP40)</option>
                  <option value="Snipers">Bolt-Action / DMRs (AWM, Kar98, M24, Mini14)</option>
                  <option value="Mixed">Mixed Loadouts</option>
                </select>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-dark-800">
            <button
              type="button"
              onClick={handleBack}
              className="px-5 py-2.5 rounded-xl font-semibold text-slate-400 hover:text-white bg-dark-850 border border-dark-700 flex items-center gap-1.5 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-brand-purple to-brand-purple-hover shadow-glow-purple flex items-center gap-2 hover:opacity-95 transition-all"
            >
              <span>Next: Review & Calibrate</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Review & Generate */}
      {step === 3 && (
        <div className="bg-dark-900/90 border border-brand-purple/30 rounded-2xl p-6 sm:p-8 shadow-card space-y-8 animate-fade-in">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-cyan/10 text-brand-cyan text-xs font-semibold mb-2 border border-brand-cyan/20">
              <Sparkles className="w-3.5 h-3.5" /> Ready for Calibration
            </div>
            <h2 className="font-gaming text-2xl sm:text-3xl font-bold text-white tracking-wide">
              STEP 3: REVIEW PARAMETERS & GENERATE
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Verify your setup profile. AimPro's deterministic engine will synthesize a calibrated starting sensitivity profile.
            </p>
          </div>

          {/* Review Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-dark-850 border border-dark-700/80 rounded-xl p-5 space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Gamepad2 className="w-4 h-4 text-brand-purple-light" />
                Selected Title & Hardware
              </h4>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Game:</span>
                  <span className="font-bold text-white uppercase">{game}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Device:</span>
                  <span className="text-white font-medium">{device.brand} {device.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Display Refresh:</span>
                  <span className="text-brand-cyan font-bold">{device.refreshRate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">RAM:</span>
                  <span className="text-white font-medium">{device.ram}</span>
                </div>
              </div>
            </div>

            <div className="bg-dark-850 border border-dark-700/80 rounded-xl p-5 space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-brand-cyan" />
                Playstyle & Diagnostics
              </h4>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Playstyle:</span>
                  <span className="font-bold text-white capitalize">{preferences.playStyle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Gyroscope:</span>
                  <span className={`font-semibold ${preferences.gyroEnabled ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {preferences.gyroEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Layout:</span>
                  <span className="text-white font-medium">{preferences.controlStyle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Key Focus:</span>
                  <span className="text-amber-400 font-medium truncate max-w-[160px]">{preferences.mainProblem}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Engine Disclaimer */}
          <div className="bg-dark-950/70 border border-dark-800 rounded-xl p-4 text-xs text-slate-400 leading-relaxed">
            <span className="text-slate-300 font-semibold">Engine Architecture:</span> The recommendation engine does not generate arbitrary numbers or claim universal perfection before testing. You will receive a mathematical starting configuration ready for verification in the AimPro interactive arena.
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-dark-800">
            <button
              type="button"
              onClick={handleBack}
              className="px-5 py-2.5 rounded-xl font-semibold text-slate-400 hover:text-white bg-dark-850 border border-dark-700 flex items-center gap-1.5 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={handleGenerate}
              className="px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-brand-purple to-brand-cyan shadow-glow-purple flex items-center gap-2 hover:opacity-95 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Calibrating Multipliers...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Recommended Sensitivity</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

