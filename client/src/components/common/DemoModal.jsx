import React, { useState } from 'react';
import { X, Play, Crosshair, Sliders, CheckCircle, ArrowRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DemoModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [demoClicks, setDemoClicks] = useState(0);
  const [demoLastReaction, setDemoLastReaction] = useState(null);
  const [targetPos, setTargetPos] = useState({ top: '45%', left: '48%' });

  if (!isOpen) return null;

  const handleTargetClick = () => {
    const rxn = Math.floor(220 + Math.random() * 120);
    setDemoLastReaction(rxn);
    setDemoClicks(c => c + 1);

    // Randomize position
    const top = Math.floor(20 + Math.random() * 60) + '%';
    const left = Math.floor(20 + Math.random() * 60) + '%';
    setTargetPos({ top, left });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl bg-dark-900 border border-brand-purple/30 rounded-2xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-dark-700 bg-dark-850/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-purple/20 border border-brand-purple/40 flex items-center justify-center">
              <Play className="w-4 h-4 text-brand-cyan fill-brand-cyan" />
            </div>
            <div>
              <h3 className="font-gaming text-lg font-bold text-white tracking-wide">
                AIMPRO INTERACTIVE DEMO
              </h3>
              <p className="text-xs text-slate-400">Preview the core workflow & precision analytics</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-dark-700 bg-dark-950 px-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === 'overview'
                ? 'border-brand-purple text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            How It Works
          </button>
          <button
            onClick={() => setActiveTab('targetTest')}
            className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === 'targetTest'
                ? 'border-brand-cyan text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Interactive Mini Target Test
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {activeTab === 'overview' ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-dark-850 border border-dark-700/80 rounded-xl p-4">
                  <div className="w-8 h-8 rounded-lg bg-brand-purple/20 flex items-center justify-center mb-3">
                    <Sliders className="w-4 h-4 text-brand-purple-light" />
                  </div>
                  <h4 className="font-semibold text-white text-sm mb-1">1. Hardware & Style Profile</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Input your device specs (RAM, 60-144Hz panel) and claw layout. AimPro calculates a tailored starting curve.
                  </p>
                </div>

                <div className="bg-dark-850 border border-dark-700/80 rounded-xl p-4">
                  <div className="w-8 h-8 rounded-lg bg-brand-cyan/20 flex items-center justify-center mb-3">
                    <Crosshair className="w-4 h-4 text-brand-cyan" />
                  </div>
                  <h4 className="font-semibold text-white text-sm mb-1">2. In-Browser Arena</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Engage moving targets in the training arena. Measure real reaction times, flick speed, and miss distribution.
                  </p>
                </div>

                <div className="bg-dark-850 border border-dark-700/80 rounded-xl p-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center mb-3">
                    <Zap className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h4 className="font-semibold text-white text-sm mb-1">3. Guided Tuning</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Receive actionable suggestions (e.g. -5% Red Dot to fix overshooting) and apply them to your profile with one click.
                  </p>
                </div>
              </div>

              <div className="bg-dark-800/60 border border-brand-purple/20 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-brand-cyan shrink-0" />
                  <p className="text-xs text-slate-300">
                    No downloads or game file modifications. 100% fair-play and browser-accessible on both PC and mobile touchscreens.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Click the glowing target to test your flick response:</span>
                <span className="font-gaming text-brand-cyan text-sm">
                  Hits: {demoClicks} | Last Reaction: {demoLastReaction ? `${demoLastReaction}ms` : '—'}
                </span>
              </div>

              {/* Mini Target Area */}
              <div className="relative h-64 bg-dark-950 border border-dark-700 rounded-xl overflow-hidden cursor-crosshair select-none">
                {/* Background grid */}
                <div className="absolute inset-0 bg-grid-pattern opacity-20" />

                {/* Target */}
                <button
                  onClick={handleTargetClick}
                  style={{ top: targetPos.top, left: targetPos.left }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gradient-to-tr from-brand-purple to-brand-cyan p-1 shadow-glow-cyan transition-all transform active:scale-90"
                >
                  <div className="w-full h-full rounded-full bg-dark-950 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-brand-cyan animate-ping opacity-75" />
                    <div className="absolute w-3 h-3 rounded-full bg-white" />
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-dark-700 bg-dark-850/70">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Close Demo
          </button>

          <Link
            to="/onboarding"
            onClick={onClose}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-brand-purple to-brand-purple-hover text-white shadow-glow-purple hover:opacity-95 transition-all"
          >
            <span>Launch Calibrator</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

