import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Award, Target, Clock, Zap, CheckCircle2, XCircle, RotateCcw,
  Sliders, TrendingUp, Sparkles, ChevronRight, BarChart2, ShieldAlert
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import { useAimTest } from '../context/AimTestContext';
import { useSensitivity } from '../context/SensitivityContext';

export default function TestResultsPage() {
  const navigate = useNavigate();
  const { lastResult, suggestedAdjustments } = useAimTest();
  const { activeConfig } = useSensitivity();
  const [saveStatus, setSaveStatus] = useState('saved');

  // Fallback demo data if user accessed page directly without a test run
  const result = lastResult || {
    score: 3420,
    accuracy: 78,
    avgReactionTime: 365,
    bestReactionTime: 232,
    hits: 21,
    misses: 6,
    expired: 2,
    duration: 30,
    mode: 'reaction',
    targetBreakdown: Array.from({ length: 15 }, (_, i) => ({
      targetId: i + 1,
      reactionTime: Math.floor(250 + Math.sin(i) * 120 + Math.random() * 80),
      hit: true
    }))
  };

  // Prepare chart data
  const chartData = (result.targetBreakdown || []).map((t, idx) => ({
    name: `T${idx + 1}`,
    ms: t.reactionTime,
    hit: t.hit
  }));

  // Analyze performance indicators
  const getAnalysisSuggestions = () => {
    const list = [];
    const acc = result.accuracy;
    const rxn = result.avgReactionTime;
    const misses = result.misses;

    if (acc < 65) {
      list.push({
        type: 'overshoot',
        title: 'Overshooting Pattern Detected',
        text: 'Your test indicates recurring off-target flick dispersion. Try reducing your primary scope sensitivity by 3–5% to prevent reticle over-travel, then retest.',
        severity: 'amber'
      });
    } else if (rxn > 480 && acc >= 75) {
      list.push({
        type: 'undershoot',
        title: 'Cautious Undershooting / High Latency',
        text: 'Your precision is solid, but swipe transit time is conservative. Try increasing camera sensitivity by +4% to acquire targets quicker.',
        severity: 'cyan'
      });
    }

    if (rxn > 450) {
      list.push({
        type: 'reaction',
        title: 'Reaction Speed Drills Recommended',
        text: 'Practice short 15-second flick drills in the Aim Arena twice daily to train muscle reflex benchmarks under 350ms.',
        severity: 'purple'
      });
    } else if (rxn < 340 && acc >= 80) {
      list.push({
        type: 'good',
        title: 'Esports-Grade Reaction Curve',
        text: 'Your reaction time and target tracking are in the upper competitive tier. Current baseline sensitivity is well-matched to your reflexes.',
        severity: 'emerald'
      });
    }

    if (list.length === 0) {
      list.push({
        type: 'balanced',
        title: 'Balanced Starting Metrics',
        text: 'Performance is stable. Complete 2 to 3 more sessions to build a multi-test confidence interval before adjusting sensitivity.',
        severity: 'cyan'
      });
    }

    return list;
  };

  const suggestions = getAnalysisSuggestions();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-dark-900 border border-dark-750 rounded-2xl p-6 sm:p-8 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20">
              Drill Mode: {result.mode.toUpperCase()}
            </span>
            <span className="text-xs text-slate-400">
              Duration: {result.duration}s
            </span>
          </div>
          <h1 className="font-gaming text-3xl sm:text-4xl font-bold text-white tracking-wide">
            PERFORMANCE TEST ANALYSIS
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Data synthesized from your latest target engagement session.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/aim-test"
            className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-dark-850 hover:bg-dark-800 text-slate-200 border border-dark-700 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Test</span>
          </Link>

          <Link
            to="/adjustments"
            className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-brand-purple to-brand-cyan text-white shadow-glow-purple flex items-center gap-1.5 transition-all"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Review Tuning Suggestions</span>
          </Link>
        </div>
      </div>

      {/* Top Level Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Score */}
        <div className="bg-dark-900/90 border border-dark-750 rounded-2xl p-4 shadow-card text-center">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Score</span>
          <p className="font-gaming text-3xl font-bold text-brand-purple-light">{result.score}</p>
          <span className="text-[10px] text-slate-500 font-sans">Points Earned</span>
        </div>

        {/* Accuracy */}
        <div className="bg-dark-900/90 border border-dark-750 rounded-2xl p-4 shadow-card text-center">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Accuracy</span>
          <p className={`font-gaming text-3xl font-bold ${result.accuracy >= 75 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {result.accuracy}%
          </p>
          <span className="text-[10px] text-slate-500 font-sans">Hits / Total Clicks</span>
        </div>

        {/* Avg Reaction */}
        <div className="bg-dark-900/90 border border-dark-750 rounded-2xl p-4 shadow-card text-center">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Avg Reaction</span>
          <p className="font-gaming text-3xl font-bold text-brand-cyan">{result.avgReactionTime}<span className="text-xs font-normal text-slate-400">ms</span></p>
          <span className="text-[10px] text-slate-500 font-sans">Mean Acquisition</span>
        </div>

        {/* Best Reaction */}
        <div className="bg-dark-900/90 border border-dark-750 rounded-2xl p-4 shadow-card text-center">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Best Reaction</span>
          <p className="font-gaming text-3xl font-bold text-white">{result.bestReactionTime}<span className="text-xs font-normal text-slate-400">ms</span></p>
          <span className="text-[10px] text-slate-500 font-sans">Peak Speed</span>
        </div>

        {/* Hits */}
        <div className="bg-dark-900/90 border border-dark-750 rounded-2xl p-4 shadow-card text-center">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Confirmed Hits</span>
          <p className="font-gaming text-3xl font-bold text-emerald-400">{result.hits}</p>
          <span className="text-[10px] text-slate-500 font-sans">On-Target</span>
        </div>

        {/* Misses */}
        <div className="bg-dark-900/90 border border-dark-750 rounded-2xl p-4 shadow-card text-center">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Misses</span>
          <p className="font-gaming text-3xl font-bold text-red-400">{result.misses}</p>
          <span className="text-[10px] text-slate-500 font-sans">Off-Target Clicks</span>
        </div>
      </div>

      {/* Charts & Diagnostics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Reaction Time Timeline Chart */}
        <div className="lg:col-span-7 bg-dark-900/90 border border-dark-750 rounded-2xl p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-gaming text-xl font-bold text-white flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-brand-cyan" />
              REACTION TIME PER TARGET (MS)
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Lower is faster</span>
          </div>

          <div className="h-64 w-full pt-4">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="reactionGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1A2438" />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={10} />
                  <YAxis stroke="#64748B" fontSize={10} domain={[150, 700]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0B0E14', borderColor: '#222F47', borderRadius: '8px' }}
                    labelStyle={{ color: '#F8FAFC' }}
                  />
                  <Area type="monotone" dataKey="ms" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#reactionGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-xs">
                No reaction datapoints logged.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Actionable Suggestions */}
        <div className="lg:col-span-5 bg-dark-900/90 border border-dark-750 rounded-2xl p-6 shadow-card space-y-4">
          <div className="flex items-center gap-2 text-white">
            <Sparkles className="w-5 h-5 text-brand-purple-light" />
            <h3 className="font-gaming text-xl font-bold tracking-wide">
              ACTIONABLE CALIBRATION TIPS
            </h3>
          </div>

          <p className="text-xs text-slate-400">
            Tailored suggestions derived from your observed click precision:
          </p>

          <div className="space-y-3">
            {suggestions.map((item, idx) => (
              <div
                key={idx}
                className="bg-dark-850 border border-dark-800 rounded-xl p-4 space-y-1.5"
              >
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${item.severity === 'amber' ? 'bg-amber-400' : item.severity === 'emerald' ? 'bg-emerald-400' : 'bg-brand-cyan'}`} />
                  <h4 className="text-xs font-bold text-slate-200">{item.title}</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed pl-4">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <Link
              to="/adjustments"
              className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-dark-800 hover:bg-dark-750 border border-brand-purple/40 text-brand-purple-light hover:text-white flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>View Proposed Sensitivity Changes</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Footer Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-dark-800">
        <Link
          to="/dashboard"
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <TrendingUp className="w-4 h-4 text-brand-cyan" />
          <span>View Cumulative Progress & Test History</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/aim-test"
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-dark-850 hover:bg-dark-800 text-slate-300 border border-dark-700 transition-colors"
          >
            Retake Test
          </Link>
          <Link
            to="/sensitivity"
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-purple hover:bg-brand-purple-hover text-white shadow-glow-purple transition-all"
          >
            Inspect Active Sensitivity
          </Link>
        </div>
      </div>
    </div>
  );
}

