import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Crosshair, Sliders, BarChart2, BookOpen, TrendingUp, Play, ArrowRight,
  Shield, Smartphone, Cpu, Check, Layers, Sparkles, ChevronRight, Zap
} from 'lucide-react';
import DemoModal from '../components/common/DemoModal';

export default function HomePage() {
  const [demoOpen, setDemoOpen] = useState(false);

  const features = [
    {
      icon: Sliders,
      title: 'Personalized Sensitivity Settings',
      description: 'Deterministic calibration based on your display refresh rate (60–144Hz), RAM capacity, gyroscope preference, and finger claw layout.',
      tag: 'Hardware-Aware',
      color: 'purple'
    },
    {
      icon: Crosshair,
      title: 'Interactive Aim Test',
      description: 'In-browser training arena measuring high-precision reaction time, flick accuracy, and click dispersion without modifying game files.',
      tag: 'Live Web Audio',
      color: 'cyan'
    },
    {
      icon: BarChart2,
      title: 'Performance Analysis',
      description: 'Accurate breakdown of target acquisition metrics. Automatically identifies overshooting, undershooting, and hesitant tracking.',
      tag: 'Zero Fabrication',
      color: 'emerald'
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Monitor your reaction times and hit accuracy over multiple sessions with clear trend charts and an audit trail of sensitivity adjustments.',
      tag: 'Audit Trail',
      color: 'amber'
    },
    {
      icon: BookOpen,
      title: 'Gaming Guides & Tips',
      description: 'In-depth tactical guides on recoil pull-down, 300%+ gyroscope handling, and display latency optimization for competitive mobile battle royales.',
      tag: 'Pro Knowledge',
      color: 'purple'
    }
  ];

  const games = [
    {
      id: 'bgmi',
      title: 'BGMI',
      fullName: 'Battlegrounds Mobile India',
      developer: 'Krafton',
      category: 'Tactical Battle Royale',
      details: 'Full support for Camera, ADS, 400% Gyroscope, and separate ADS Gyro arrays across all scopes.',
      badge: 'v3.5 Calibrated',
      accent: 'border-brand-purple/40 hover:border-brand-purple'
    },
    {
      id: 'pubgm',
      title: 'PUBG Mobile',
      fullName: 'PUBG Mobile Global',
      developer: 'Level Infinite / Lightspeed',
      category: 'Global Esports BR',
      details: 'Precise scope curves for Red Dot through 8x scope with frame-rate sync for 90Hz & 120Hz flagships.',
      badge: 'Global Edition',
      accent: 'border-brand-cyan/40 hover:border-brand-cyan'
    },
    {
      id: 'freefire',
      title: 'Free Fire / FF MAX',
      fullName: 'Garena Free Fire MAX',
      developer: 'Garena',
      category: 'Fast-Paced Action BR',
      details: 'Optimized 0–100 scale calibrator for one-tap headshot drag timing, General Look, and Free Look agility.',
      badge: 'OB48 Ready',
      accent: 'border-amber-500/40 hover:border-amber-500'
    }
  ];

  return (
    <div className="relative">
      {/* Background visual ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-radial from-brand-purple/15 via-brand-cyan/5 to-transparent pointer-events-none -z-10 blur-2xl" />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-dark-850 border border-brand-purple/30 text-xs text-brand-purple-light shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-brand-cyan" />
                <span className="font-semibold uppercase tracking-wider">Esports-Grade Sensitivity Engine</span>
              </div>

              <div className="space-y-3">
                <h1 className="font-gaming text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-none">
                  FIND YOUR <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple-light via-brand-cyan to-white">
                    PERFECT SENSITIVITY
                  </span>
                </h1>
                <p className="font-gaming text-2xl sm:text-3xl text-brand-cyan font-semibold tracking-wide">
                  Analyze. Test. Improve.
                </p>
              </div>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Discover personalized sensitivity settings, test your aim, and improve your mobile gaming performance with data-driven recommendations tailored to your device, refresh rate, and playstyle.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/onboarding"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-brand-purple to-brand-purple-hover shadow-glow-purple hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <span>Start Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => setDemoOpen(true)}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-slate-200 bg-dark-850 hover:bg-dark-800 border border-dark-700 hover:border-brand-cyan/40 transition-all flex items-center justify-center gap-2 group"
                >
                  <Play className="w-4 h-4 text-brand-cyan fill-brand-cyan group-hover:scale-110 transition-transform" />
                  <span>Watch Demo</span>
                </button>
              </div>

              {/* Feature Pills */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs text-slate-400">
                <div className="flex items-center gap-1.5 bg-dark-900/80 px-3 py-1 rounded-md border border-dark-700/60">
                  <Check className="w-3.5 h-3.5 text-brand-cyan" />
                  <span>No Blind Copying</span>
                </div>
                <div className="flex items-center gap-1.5 bg-dark-900/80 px-3 py-1 rounded-md border border-dark-700/60">
                  <Check className="w-3.5 h-3.5 text-brand-cyan" />
                  <span>Interactive Hit Testing</span>
                </div>
                <div className="flex items-center gap-1.5 bg-dark-900/80 px-3 py-1 rounded-md border border-dark-700/60">
                  <Check className="w-3.5 h-3.5 text-brand-cyan" />
                  <span>Undoable Adjustments</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Glow ring */}
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-brand-purple via-brand-cyan to-brand-purple-dark opacity-30 blur-xl animate-pulse" />

                <div className="relative bg-dark-900/90 border border-brand-purple/30 rounded-2xl p-6 shadow-card backdrop-blur-md">
                  {/* Visual Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-dark-700/80">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                      <span className="text-xs font-gaming tracking-wider text-slate-400 ml-2">
                        AIMPRO CORE RADAR
                      </span>
                    </div>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20">
                      LIVE ENGINE
                    </span>
                  </div>

                  {/* Interactive Visual Representation */}
                  <div className="py-6 space-y-4">
                    {/* Simulated Calibrated Curve */}
                    <div className="bg-dark-950 p-4 rounded-xl border border-dark-800">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-slate-400">ADS Red Dot Pull-Down</span>
                        <span className="font-mono text-brand-cyan font-bold">65% (Optimal)</span>
                      </div>
                      <div className="w-full bg-dark-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-brand-purple to-brand-cyan h-full rounded-full w-[65%]" />
                      </div>
                    </div>

                    <div className="bg-dark-950 p-4 rounded-xl border border-dark-800">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-slate-400">Full Gyroscope TPP Agility</span>
                        <span className="font-mono text-brand-purple-light font-bold">340% (Active)</span>
                      </div>
                      <div className="w-full bg-dark-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-brand-purple to-brand-purple-light h-full rounded-full w-[85%]" />
                      </div>
                    </div>

                    {/* Mini Target Acquisition Box */}
                    <div className="relative h-28 bg-dark-950 rounded-xl border border-dark-800 flex items-center justify-around overflow-hidden">
                      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
                      
                      <div className="relative text-center">
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">Reaction Floor</p>
                        <p className="font-gaming text-2xl font-bold text-white">218<span className="text-xs font-normal text-slate-400">ms</span></p>
                      </div>

                      <div className="h-8 w-[1px] bg-dark-700" />

                      <div className="relative text-center">
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">Acquisition Rate</p>
                        <p className="font-gaming text-2xl font-bold text-emerald-400">92.4<span className="text-xs font-normal text-slate-400">%</span></p>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-dark-700/60">
                    <span className="flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-brand-cyan" />
                      120Hz Touch Sampling
                    </span>
                    <Link
                      to="/aim-test"
                      className="text-brand-purple-light hover:text-white font-medium flex items-center gap-1"
                    >
                      Enter Arena <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Games Section */}
      <section className="py-16 bg-dark-900/40 border-y border-dark-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-gaming text-3xl font-bold text-white tracking-wide uppercase">
              Supported Mobile Battle Royales
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Each title uses custom mathematical curves, sensitivity scale caps, and weapon control mechanics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {games.map((game) => (
              <div
                key={game.id}
                className={`bg-dark-850/80 border ${game.accent} rounded-2xl p-6 transition-all hover:-translate-y-1 shadow-card flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono px-2.5 py-1 rounded bg-dark-800 text-slate-300 border border-dark-700">
                      {game.developer}
                    </span>
                    <span className="text-xs font-bold text-brand-cyan bg-brand-cyan/10 px-2.5 py-0.5 rounded-full border border-brand-cyan/20">
                      {game.badge}
                    </span>
                  </div>

                  <h3 className="font-gaming text-2xl font-bold text-white mb-1">
                    {game.title}
                  </h3>
                  <p className="text-xs text-brand-purple-light font-medium mb-3">
                    {game.fullName}
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {game.details}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-dark-700/60">
                  <Link
                    to="/onboarding"
                    className="w-full py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-dark-800 hover:bg-dark-750 text-slate-200 hover:text-white border border-dark-700 hover:border-brand-purple flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Calibrate for {game.title}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase font-mono tracking-widest text-brand-cyan bg-brand-cyan/10 px-3 py-1 rounded-md border border-brand-cyan/20">
              End-To-End Architecture
            </span>
            <h2 className="font-gaming text-3xl sm:text-4xl font-bold text-white tracking-wide mt-3">
              BUILT FOR MEASURABLE RESULTS
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Replace guesswork with repeatable aim-testing diagnostics and personalized hardware adjustments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-dark-850/60 border border-dark-750 hover:border-brand-purple/40 rounded-2xl p-6 transition-all hover:bg-dark-850 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-dark-800 border border-dark-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5 text-brand-cyan group-hover:text-brand-purple-light transition-colors" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 bg-dark-900 px-2 py-0.5 rounded border border-dark-750">
                      {feat.tag}
                    </span>
                  </div>

                  <h3 className="font-semibold text-white text-base mb-2 group-hover:text-brand-cyan transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-r from-dark-850 via-dark-800 to-dark-850 border border-brand-purple/40 p-8 sm:p-12 overflow-hidden shadow-card text-center">
            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <h2 className="font-gaming text-3xl sm:text-4xl font-extrabold text-white tracking-wide">
                READY TO STOP COPYING SENSITIVITIES?
              </h2>
              <p className="text-sm text-slate-300">
                Calibrate your device profile, fire up the Aim Arena, and track your aiming precision in minutes.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/onboarding"
                  className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-brand-purple to-brand-purple-hover shadow-glow-purple hover:scale-[1.02] transition-all"
                >
                  Launch 3-Step Wizard
                </Link>
                <Link
                  to="/aim-test"
                  className="w-full sm:w-auto px-8 py-3 rounded-xl font-semibold text-slate-200 bg-dark-900 border border-dark-700 hover:border-brand-cyan/40 transition-all"
                >
                  Jump Directly into Arena
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Modal */}
      <DemoModal isOpen={demoOpen} onClose={() => setDemoOpen(false)} />
    </div>
  );
}

