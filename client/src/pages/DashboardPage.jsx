import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp, Award, Target, Clock, Zap, Sliders, History, Download,
  ExternalLink, Trash2, CheckCircle2, Crosshair, ArrowRight, Smartphone
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useSensitivity } from '../context/SensitivityContext';
import { useAimTest } from '../context/AimTestContext';

export default function DashboardPage() {
  const { user, isGuest } = useAuth();
  const { savedConfigs, setActiveConfig, exportSettings } = useSensitivity();
  const { testHistory, testStats } = useAimTest();

  // Create chart data from history
  const chartData = [...testHistory].reverse().map((t, idx) => ({
    name: `Run ${idx + 1}`,
    accuracy: t.accuracy,
    reaction: t.avgReactionTime,
    score: t.score
  }));

  // Fallback demo chart data if no history yet
  const displayChartData = chartData.length > 0 ? chartData : [
    { name: 'Run 1', accuracy: 62, reaction: 440, score: 2100 },
    { name: 'Run 2', accuracy: 68, reaction: 410, score: 2600 },
    { name: 'Run 3', accuracy: 74, reaction: 375, score: 3100 },
    { name: 'Run 4', accuracy: 82, reaction: 330, score: 3750 }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-8 animate-fade-in">
      {/* Dashboard Header */}
      <div className="bg-dark-900 border border-dark-750 rounded-2xl p-6 sm:p-8 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded ${
              isGuest ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
            }`}>
              {isGuest ? 'Guest Storage (Local Session)' : 'Cloud Synchronized'}
            </span>
          </div>
          <h1 className="font-gaming text-3xl sm:text-4xl font-bold text-white tracking-wide">
            PERFORMANCE DASHBOARD
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track your aim progression, monitor reaction improvements, and manage saved game configurations.
          </p>
        </div>

        <Link
          to="/aim-test"
          className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-brand-purple to-brand-cyan text-white shadow-glow-purple hover:opacity-95 flex items-center gap-2 self-start sm:self-auto transition-all"
        >
          <Crosshair className="w-4 h-4" />
          <span>Launch Aim Arena</span>
        </Link>
      </div>

      {/* Aggregate Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-dark-900/90 border border-dark-750 rounded-2xl p-4 shadow-card">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Tests Completed</span>
            <Target className="w-4 h-4 text-brand-purple-light" />
          </div>
          <p className="font-gaming text-3xl font-bold text-white">{testStats.totalTests || testHistory.length}</p>
          <span className="text-[10px] text-slate-500">Tracked Sessions</span>
        </div>

        <div className="bg-dark-900/90 border border-dark-750 rounded-2xl p-4 shadow-card">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Mean Accuracy</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="font-gaming text-3xl font-bold text-emerald-400">
            {testStats.avgAccuracy || 74}%
          </p>
          <span className="text-[10px] text-slate-500">Hit Precision</span>
        </div>

        <div className="bg-dark-900/90 border border-dark-750 rounded-2xl p-4 shadow-card">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Avg Reaction</span>
            <Clock className="w-4 h-4 text-brand-cyan" />
          </div>
          <p className="font-gaming text-3xl font-bold text-brand-cyan">
            {testStats.avgReaction || 365}<span className="text-xs font-normal text-slate-400">ms</span>
          </p>
          <span className="text-[10px] text-slate-500">Acquisition Floor</span>
        </div>

        <div className="bg-dark-900/90 border border-dark-750 rounded-2xl p-4 shadow-card">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">High Score</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <p className="font-gaming text-3xl font-bold text-white">
            {testStats.bestScore || 3420}
          </p>
          <span className="text-[10px] text-slate-500">Arena Record</span>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Accuracy Progression Chart */}
        <div className="bg-dark-900/90 border border-dark-750 rounded-2xl p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-gaming text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              ACCURACY PROGRESSION (%)
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Goal: &gt; 80%</span>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={displayChartData}>
                <defs>
                  <linearGradient id="accGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A2438" />
                <XAxis dataKey="name" stroke="#64748B" fontSize={10} />
                <YAxis stroke="#64748B" fontSize={10} domain={[40, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B0E14', borderColor: '#222F47', borderRadius: '8px' }}
                />
                <Area type="monotone" dataKey="accuracy" stroke="#10B981" strokeWidth={2} fill="url(#accGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Reaction Time Trend */}
        <div className="bg-dark-900/90 border border-dark-750 rounded-2xl p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-gaming text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-cyan" />
              REACTION TIME CURVE (MS)
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Lower is faster</span>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={displayChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A2438" />
                <XAxis dataKey="name" stroke="#64748B" fontSize={10} />
                <YAxis stroke="#64748B" fontSize={10} domain={[200, 600]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B0E14', borderColor: '#222F47', borderRadius: '8px' }}
                />
                <Line type="monotone" dataKey="reaction" stroke="#06B6D4" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Saved Configurations List */}
      <div className="bg-dark-900 border border-dark-750 rounded-2xl p-6 sm:p-8 shadow-card space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-gaming text-2xl font-bold text-white tracking-wide flex items-center gap-2">
            <Sliders className="w-5 h-5 text-brand-purple-light" />
            SAVED GAME CONFIGURATIONS
          </h2>
          <Link
            to="/onboarding"
            className="text-xs text-brand-cyan hover:underline flex items-center gap-1 font-semibold"
          >
            Create New Profile <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {savedConfigs.length === 0 ? (
          <div className="bg-dark-950 p-6 rounded-xl border border-dark-800 text-center text-xs text-slate-400">
            No custom profiles saved yet. Calibrate your first setup using the wizard.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedConfigs.map((cfg) => (
              <div
                key={cfg._id || cfg.id}
                className="bg-dark-850 border border-dark-700/80 rounded-xl p-5 flex flex-col justify-between space-y-4 hover:border-brand-purple/40 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-brand-purple/20 text-brand-purple-light">
                      {cfg.game?.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(cfg.updatedAt || cfg.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h4 className="font-bold text-white text-base mb-1">{cfg.title}</h4>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <Smartphone className="w-3 h-3 text-brand-cyan" />
                    {cfg.device?.brand} {cfg.device?.model} ({cfg.device?.refreshRate || '90Hz'})
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-dark-800">
                  <button
                    onClick={() => {
                      setActiveConfig(cfg);
                      window.location.href = '/sensitivity';
                    }}
                    className="text-xs font-semibold text-brand-cyan hover:underline"
                  >
                    Open Profile
                  </button>
                  <button
                    onClick={() => exportSettings('json')}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-dark-800"
                    title="Export JSON"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

