import React, { useState } from 'react';
import {
  BookOpen, ChevronDown, ChevronUp, Crosshair, Smartphone,
  Zap, ShieldAlert, Cpu, Sparkles, CheckCircle2, ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function GuidesPage() {
  const [openGuide, setOpenGuide] = useState(0);

  const guides = [
    {
      title: 'Mastering Vertical Recoil: Gyroscope Tilt vs Thumb Drag Mechanics',
      category: 'Recoil Control',
      readTime: '4 min read',
      summary: 'Learn how to split your recoil compensation between physical wrist tilt and thumb drag for laser-straight sprays on 3x and 4x scopes.',
      content: [
        'Why Recoil Drag Fails on High-RPM Weapons: When firing an M416 or Beryl M762, the vertical rise accelerates during the first 10 rounds before stabilizing into horizontal bloom. If your ADS sensitivity is too low, your thumb hits the bottom bezel of your phone before the spray finishes.',
        'The Gyroscope Advantage: Setting your 3x and 4x Gyroscope sensitivity to 220–280% allows you to control the entire vertical pull simply by tilting your phone downward 15 to 20 degrees. This keeps your right thumb 100% free for micro-flicks and tracking moving targets.',
        'ADS vs Non-ADS Gyroscope Tuning: In BGMI and PUBG Mobile, separate your "Camera Gyro" from "ADS Gyro". Keep Camera Gyro agile (300%+) for rapid target scouting, but reduce ADS Gyro by 5-10% to prevent erratic jitter while holding down fire.'
      ]
    },
    {
      title: 'Touch Sampling Latency: Why 60Hz, 90Hz & 120Hz Screens Require Different Curves',
      category: 'Hardware Physics',
      readTime: '3 min read',
      summary: 'How display refresh rates and capacitive digitizer touch sampling intervals dictate your ideal sensitivity multiplier.',
      content: [
        'The 60Hz Latency Trap: On a 60Hz display, a new frame is rendered every 16.6 milliseconds. If your swipe input falls between frame redraws, input latency creates a sluggish feeling. Gamers often mistakenly crank their sensitivity to maximum, causing severe overshooting.',
        '120Hz & 144Hz Fluidity: At 120Hz (8.3ms per frame), your reticle follows your finger in near real-time. On 120Hz panels, you can safely use tighter, slightly lower sensitivity curves (3-5% lower than 60Hz) because you have instant visual feedback.',
        'AimPro Formula: Our recommendation engine automatically scales touch friction curves based on your hardware refresh profile to prevent erratic crosshair float.'
      ]
    },
    {
      title: 'Free Fire One-Tap Drag Calibration: General Look vs Red Dot Timing',
      category: 'Free Fire MAX',
      readTime: '3 min read',
      summary: 'Secrets to landing consistent one-tap headshots with Desert Eagle, M1887, and Woodpecker without overshooting the enemy hit-box.',
      content: [
        'The Auto-Aim Threshold: Free Fire features aggressive built-in aim assist. When you drag your fire button upwards, your reticle must break the chest lock and snap onto the head. If your "General" sensitivity is below 85, your drag will stay locked on the chest.',
        'Overshooting the Head: Conversely, if your General sensitivity is too high (or screen DPI is over-inflated), your reticle will skip the head hitbox and fire into the sky. AimPro recommends starting between 92 and 96 for General Look on 6.5"+ screens.',
        'Fire Button Positioning: Place your right fire button in the lower third of your screen with a size scale of 45-55% to give your thumb ample upward runway for clean flick-drags.'
      ]
    },
    {
      title: 'Control Layouts & Claw Ergonomics: 2-Finger vs 3/4-Finger Optimization',
      category: 'Ergonomics',
      readTime: '5 min read',
      summary: 'Match your sensitivity curve to your finger layout to prevent hand strain and improve target acquisition speed.',
      content: [
        '2-Finger Thumbs: Requires higher ADS sensitivity (or heavy reliance on Gyroscope) because your right thumb must simultaneously trigger the fire button and drag downward for recoil.',
        '3-Finger Claw: Moves the fire button to your left index finger. This frees your right thumb solely for aiming, allowing you to use a slightly lower, more precise sensitivity.',
        '4-Finger Claw: The competitive esports standard. Left index fires, right index scopes in/crouches/jumps, and both thumbs steer movement and crosshair independently.'
      ]
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-dark-900 border border-dark-750 rounded-2xl p-6 sm:p-8 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-cyan/10 text-brand-cyan text-xs font-semibold mb-2 border border-brand-cyan/20">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Competitive Mechanics Archive</span>
          </div>
          <h1 className="font-gaming text-3xl sm:text-4xl font-bold text-white tracking-wide">
            PRO GAMING & SENSITIVITY GUIDES
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Proven tactical tutorials on recoil pull-down, gyroscope calibration, and touch screen physics.
          </p>
        </div>

        <Link
          to="/onboarding"
          className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-brand-purple to-brand-purple-hover text-white shadow-glow-purple flex items-center gap-2 self-start sm:self-auto hover:opacity-95 transition-all"
        >
          <span>Calibrate My Setup</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Guides Accordion */}
      <div className="space-y-4">
        {guides.map((g, idx) => {
          const isOpen = openGuide === idx;
          return (
            <div
              key={idx}
              className="bg-dark-900/90 border border-dark-750 rounded-2xl overflow-hidden shadow-card transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenGuide(isOpen ? -1 : idx)}
                className="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-dark-850/60 transition-colors"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded bg-dark-800 text-brand-cyan border border-dark-700">
                      {g.category}
                    </span>
                    <span className="text-xs text-slate-500">{g.readTime}</span>
                  </div>
                  <h3 className="font-gaming text-xl font-bold text-white">
                    {g.title}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {g.summary}
                  </p>
                </div>

                <div className="p-2 rounded-xl bg-dark-850 text-slate-400 shrink-0">
                  {isOpen ? <ChevronUp className="w-5 h-5 text-white" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-6 pb-6 pt-2 border-t border-dark-800/80 space-y-4 text-xs text-slate-300 leading-relaxed animate-fade-in">
                  {g.content.map((paragraph, pIdx) => (
                    <div key={pIdx} className="p-4 rounded-xl bg-dark-850/80 border border-dark-800">
                      <p>{paragraph}</p>
                    </div>
                  ))}

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-slate-400">Ready to test these techniques?</span>
                    <Link
                      to="/aim-test"
                      className="text-brand-purple-light hover:text-white font-semibold flex items-center gap-1"
                    >
                      <span>Jump into Aim Arena</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

