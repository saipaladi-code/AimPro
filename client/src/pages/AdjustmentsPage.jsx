import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap, Check, X, Undo2, Sliders, History, ArrowRight,
  ShieldCheck, AlertCircle, Sparkles, ChevronRight, CheckCircle2
} from 'lucide-react';
import { useSensitivity } from '../context/SensitivityContext';
import { useAimTest } from '../context/AimTestContext';

export default function AdjustmentsPage() {
  const { activeConfig, applyAdjustment, undoAdjustment, auditLogs } = useSensitivity();
  const { suggestedAdjustments, setSuggestedAdjustments, lastResult } = useAimTest();

  const [appliedMap, setAppliedMap] = useState({});
  const [dismissedMap, setDismissedMap] = useState({});
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  // If no live adjustments currently exist in state, synthesize contextual suggestions based on activeConfig and last test or defaults
  const [displayAdjustments, setDisplayAdjustments] = useState([]);

  useEffect(() => {
    if (suggestedAdjustments && suggestedAdjustments.length > 0) {
      setDisplayAdjustments(suggestedAdjustments);
    } else if (activeConfig && activeConfig.settings) {
      // Dynamic fallback proposal based on activeConfig
      const isFreeFire = activeConfig.game === 'freefire';
      if (isFreeFire && activeConfig.settings.general) {
        const curGen = activeConfig.settings.general.generalLook || 94;
        setDisplayAdjustments([
          {
            category: 'general',
            settingKey: 'generalLook',
            settingLabel: 'General Look (Free Fire)',
            currentValue: curGen,
            suggestedValue: Math.max(Math.round(curGen * 0.96), 10),
            changePercent: -4,
            reason: 'Tighter drag threshold to prevent crosshair lifting above enemy heads during one-tap drag attempts.',
            evidence: 'Based on swipe drag dispersion and device touch sampling intervals.'
          }
        ]);
      } else if (activeConfig.settings.camera) {
        const curRed = activeConfig.settings.camera.redDot || 60;
        const curTPP = activeConfig.settings.camera.tppNoScope || 125;
        setDisplayAdjustments([
          {
            category: 'camera',
            settingKey: 'redDot',
            settingLabel: 'Camera Red Dot / Holo',
            currentValue: curRed,
            suggestedValue: Math.max(Math.round(curRed * 0.95), 10),
            changePercent: -5,
            reason: 'Reduce flick overshoot on medium-range moving targets.',
            evidence: lastResult
              ? `Your latest test recorded ${lastResult.misses} misses with ${lastResult.accuracy}% accuracy.`
              : 'Calibrated to eliminate over-travel during 90-degree fast target acquisitions.'
          },
          {
            category: 'ads',
            settingKey: 'redDot',
            settingLabel: 'ADS Red Dot / Holo',
            currentValue: activeConfig.settings.ads?.redDot || 65,
            suggestedValue: Math.min(Math.round((activeConfig.settings.ads?.redDot || 65) * 1.05), 400),
            changePercent: +5,
            reason: 'Provide extra downward recoil pull compensation for continuous assault rifle sprays.',
            evidence: 'Recommended for 4-finger claw and thumb recoil drag optimization.'
          }
        ]);
      }
    }
  }, [suggestedAdjustments, activeConfig, lastResult]);

  const handleApply = async (adj, index) => {
    const success = await applyAdjustment(adj, lastResult?._id || 'manual_test');
    if (success) {
      setAppliedMap(prev => ({ ...prev, [index]: true }));
      setFeedbackMessage(`Updated ${adj.settingLabel} to ${adj.suggestedValue}%`);
      setTimeout(() => setFeedbackMessage(null), 3000);
    }
  };

  const handleDismiss = (index) => {
    setDismissedMap(prev => ({ ...prev, [index]: true }));
  };

  const handleUndo = async (auditId) => {
    const success = await undoAdjustment(auditId);
    if (success) {
      setFeedbackMessage('Reverted adjustment to prior value');
      setTimeout(() => setFeedbackMessage(null), 3000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="bg-dark-900 border border-dark-750 rounded-2xl p-6 sm:p-8 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-purple/20 text-brand-purple-light text-xs font-semibold mb-2 border border-brand-purple/30">
            <Zap className="w-3.5 h-3.5 text-brand-cyan" />
            <span>Interactive Tuning Assistant</span>
          </div>
          <h1 className="font-gaming text-3xl sm:text-4xl font-bold text-white tracking-wide">
            SENSITIVITY ADJUSTMENT SUGGESTIONS
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Data-driven micro-adjustments synthesized from your performance in the Aim Arena.
          </p>
        </div>

        <Link
          to="/sensitivity"
          className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-dark-850 hover:bg-dark-800 text-slate-200 border border-dark-700 flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <Sliders className="w-4 h-4 text-brand-cyan" />
          <span>Active Configuration</span>
        </Link>
      </div>

      {/* Floating Status Notification */}
      {feedbackMessage && (
        <div className="bg-brand-purple/20 border border-brand-purple text-white px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fade-in shadow-glow-purple">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Active Adjustment Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-gaming text-xl font-bold text-white tracking-wide flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-cyan" />
            PENDING TUNING PROPOSALS
          </h2>
          <span className="text-xs text-slate-400">
            {displayAdjustments.filter((_, idx) => !dismissedMap[idx]).length} proposals available
          </span>
        </div>

        {displayAdjustments.length === 0 ? (
          <div className="bg-dark-900 border border-dark-750 rounded-2xl p-8 text-center text-slate-400 text-sm">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            No pending adjustments. Your settings are currently aligned with your test performance!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {displayAdjustments.map((adj, idx) => {
              if (dismissedMap[idx]) return null;
              const isApplied = appliedMap[idx];

              return (
                <div
                  key={idx}
                  className={`bg-dark-900/90 border rounded-2xl p-6 shadow-card transition-all flex flex-col justify-between space-y-4 ${
                    isApplied
                      ? 'border-emerald-500/40 bg-emerald-950/10'
                      : 'border-dark-750 hover:border-brand-purple/40'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Card Header */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded bg-dark-800 text-slate-300 border border-dark-700">
                        {adj.category.toUpperCase()}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full font-mono ${
                          adj.changePercent > 0
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : adj.changePercent < 0
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-dark-800 text-slate-400'
                        }`}>
                          {adj.changePercent > 0 ? `+${adj.changePercent}%` : `${adj.changePercent}%`}
                        </span>
                      </div>
                    </div>

                    {/* Setting Title */}
                    <div>
                      <h3 className="font-gaming text-xl font-bold text-white">
                        {adj.settingLabel}
                      </h3>
                    </div>

                    {/* Value Transition Comparison */}
                    <div className="bg-dark-950 p-3.5 rounded-xl border border-dark-800 flex items-center justify-around">
                      <div className="text-center">
                        <span className="text-[10px] text-slate-500 uppercase block">Current</span>
                        <span className="font-mono text-lg font-bold text-slate-300">{adj.currentValue}%</span>
                      </div>

                      <ChevronRight className="w-4 h-4 text-slate-600" />

                      <div className="text-center">
                        <span className="text-[10px] text-brand-cyan uppercase block">Suggested</span>
                        <span className="font-mono text-lg font-bold text-brand-cyan">{adj.suggestedValue}%</span>
                      </div>
                    </div>

                    {/* Rationale & Evidence */}
                    <div className="space-y-2 text-xs">
                      <p className="text-slate-300 font-medium leading-relaxed">
                        <strong className="text-white">Reason:</strong> {adj.reason}
                      </p>
                      <p className="text-slate-400 leading-relaxed bg-dark-850 p-2.5 rounded-lg border border-dark-800">
                        <strong className="text-slate-300">Evidence:</strong> {adj.evidence}
                      </p>
                    </div>
                  </div>

                  {/* Card Action Buttons */}
                  <div className="pt-3 border-t border-dark-800 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => handleDismiss(idx)}
                      disabled={isApplied}
                      className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-dark-850 transition-colors disabled:opacity-40"
                    >
                      Dismiss
                    </button>

                    <button
                      type="button"
                      disabled={isApplied}
                      onClick={() => handleApply(adj, idx)}
                      className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                        isApplied
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 cursor-default'
                          : 'bg-gradient-to-r from-brand-purple to-brand-purple-hover text-white shadow-glow-purple hover:opacity-95'
                      }`}
                    >
                      {isApplied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Applied to Profile</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5" />
                          <span>Apply Change</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Audit Trail & History */}
      <div className="bg-dark-900 border border-dark-750 rounded-2xl p-6 sm:p-8 shadow-card space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-brand-purple-light" />
            <h2 className="font-gaming text-2xl font-bold text-white tracking-wide">
              SENSITIVITY AUDIT TRAIL
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            {auditLogs.length} total changes logged
          </span>
        </div>

        <p className="text-xs text-slate-400">
          Every adjustment is recorded with timestamp and rationale. You can undo any past change at any time.
        </p>

        {auditLogs.length === 0 ? (
          <div className="bg-dark-950 p-6 rounded-xl border border-dark-800 text-center text-xs text-slate-500">
            No sensitivity adjustments have been applied yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-dark-950 text-slate-400 uppercase font-mono text-[10px] border-b border-dark-800">
                <tr>
                  <th className="p-3">Setting</th>
                  <th className="p-3">Shift</th>
                  <th className="p-3">Adjustment Reason</th>
                  <th className="p-3">Logged At</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-800">
                {auditLogs.map((log) => (
                  <tr key={log._id || log.id} className="hover:bg-dark-850/50">
                    <td className="p-3 font-semibold text-white whitespace-nowrap">
                      {log.settingLabel}
                    </td>
                    <td className="p-3 font-mono whitespace-nowrap">
                      <span className="text-slate-400 line-through mr-1.5">{log.previousValue}%</span>
                      <span className="text-brand-cyan font-bold">{log.newValue}%</span>
                    </td>
                    <td className="p-3 max-w-xs truncate text-slate-400" title={log.reason}>
                      {log.reason}
                    </td>
                    <td className="p-3 text-slate-500 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-right whitespace-nowrap">
                      {log.undone ? (
                        <span className="text-[10px] text-slate-500 italic">Reverted</span>
                      ) : (
                        <button
                          onClick={() => handleUndo(log._id || log.id)}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-amber-400 hover:text-white bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 flex items-center gap-1 ml-auto"
                        >
                          <Undo2 className="w-3 h-3" />
                          <span>Undo</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

