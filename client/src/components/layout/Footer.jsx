import React from 'react';
import { Link } from 'react-router-dom';
import { Crosshair, ShieldCheck, Cpu, Activity, ExternalLink, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-dark-950 border-t border-dark-700/60 text-slate-400 text-sm mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-purple to-brand-cyan flex items-center justify-center p-0.5">
                <div className="w-full h-full bg-dark-950 rounded-[7px] flex items-center justify-center">
                  <Crosshair className="w-4 h-4 text-brand-cyan" />
                </div>
              </div>
              <span className="font-gaming text-xl font-bold tracking-wider text-white">
                AIM<span className="text-brand-purple">PRO</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Professional mobile gaming performance analyzer and sensitivity assistant. Calibrate, test, and master your aim for competitive mobile battle royales.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md w-fit">
              <Activity className="w-3.5 h-3.5" />
              <span>Sensitivity Engine v2.4 Active</span>
            </div>
          </div>

          {/* Quick Tools */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs tracking-wider uppercase">Esports Tools</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/onboarding" className="hover:text-brand-cyan transition-colors">Sensitivity Calibrator</Link>
              </li>
              <li>
                <Link to="/aim-test" className="hover:text-brand-cyan transition-colors">Interactive Aim Arena</Link>
              </li>
              <li>
                <Link to="/adjustments" className="hover:text-brand-cyan transition-colors">Tuning Suggestions & Audit</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-brand-cyan transition-colors">Performance Dashboard</Link>
              </li>
              <li>
                <Link to="/guides" className="hover:text-brand-cyan transition-colors">Recoil & Gyro Guides</Link>
              </li>
            </ul>
          </div>

          {/* Supported Titles */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs tracking-wider uppercase">Supported Games</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center justify-between">
                <span>BGMI (Battlegrounds Mobile India)</span>
                <span className="text-[10px] bg-dark-800 text-brand-purple-light px-1.5 py-0.5 rounded">v3.5</span>
              </li>
              <li className="flex items-center justify-between">
                <span>PUBG Mobile</span>
                <span className="text-[10px] bg-dark-800 text-brand-cyan px-1.5 py-0.5 rounded">Global</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Free Fire / FF MAX</span>
                <span className="text-[10px] bg-dark-800 text-amber-400 px-1.5 py-0.5 rounded">OB48</span>
              </li>
            </ul>
          </div>

          {/* Calibrations & Methodology */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs tracking-wider uppercase">Methodology</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              AimPro utilizes hardware refresh rate intervals, touch sample matrices, and target acquisition reaction data to compute personalized starting benchmarks.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-brand-cyan" />
              <span>Independent & Fair Play Compatible</span>
            </div>
          </div>
        </div>

        {/* Disclaimer Bar */}
        <div className="mt-10 pt-6 border-t border-dark-800/80">
          <div className="bg-dark-900/60 border border-dark-700/50 rounded-xl p-4 mb-6">
            <p className="text-[11px] text-slate-400 leading-relaxed text-center sm:text-left">
              <strong className="text-slate-300">Disclaimer:</strong> These values are starting recommendations. Actual performance varies by player, game version, control layout, and device. Test and adjust settings in the AimPro Arena and your game's training grounds to find what works best for your muscle memory. All game titles, trademarks, and logos belong to their respective copyright holders.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} AimPro Analytics. Engineered for Competitive Mobile Gamers.</p>
            <div className="flex items-center gap-4">
              <Link to="/guides" className="hover:text-slate-300">Documentation</Link>
              <Link to="/onboarding" className="hover:text-slate-300">Start Calibrator</Link>
              <Link to="/auth" className="hover:text-slate-300">Cloud Sync</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

