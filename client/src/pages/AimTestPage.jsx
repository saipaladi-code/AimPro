import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Crosshair, Play, RotateCcw, Volume2, VolumeX, Clock, Target,
  Award, Zap, AlertCircle, Sparkles, CheckCircle2, ChevronRight
} from 'lucide-react';
import { soundFX } from '../utils/audio';
import { useAimTest } from '../context/AimTestContext';
import { useSensitivity } from '../context/SensitivityContext';

export default function AimTestPage() {
  const navigate = useNavigate();
  const { submitTestResult } = useAimTest();
  const { activeConfig } = useSensitivity();

  // Test Configurations
  const [duration, setDuration] = useState(30); // 15, 30, 60 seconds
  const [testMode, setTestMode] = useState('reaction'); // reaction, precision, speed
  const [isMuted, setIsMuted] = useState(false);

  // Test Lifecycle States: 'idle' | 'countdown' | 'active' | 'finished'
  const [gameState, setGameState] = useState('idle');
  const [countdown, setCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(30);

  // Scoring & Performance States
  const [score, setScore] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [expired, setExpired] = useState(0);
  const [totalSpawned, setTotalSpawned] = useState(0);
  const [currentTarget, setCurrentTarget] = useState(null);
  const [targetHistory, setTargetHistory] = useState([]);
  const [hitFeedback, setHitFeedback] = useState(null); // visual hit ripple

  // Timing references
  const arenaRef = useRef(null);
  const targetSpawnTimeRef = useRef(0);
  const timerIntervalRef = useRef(null);
  const targetTimeoutRef = useRef(null);
  const currentTargetIdRef = useRef(0);

  // Toggle Mute
  const toggleSound = () => {
    const muted = soundFX.toggleMute();
    setIsMuted(muted);
  };

  // Start Countdown
  const startTest = () => {
    setGameState('countdown');
    setCountdown(3);
    setScore(0);
    setHits(0);
    setMisses(0);
    setExpired(0);
    setTotalSpawned(0);
    setTargetHistory([]);
    setTimeLeft(duration);

    soundFX.playCountdown(false);

    let count = 3;
    const countTimer = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
        soundFX.playCountdown(false);
      } else {
        clearInterval(countTimer);
        soundFX.playCountdown(true);
        beginActiveGameplay();
      }
    }, 1000);
  };

  // Begin Active Gameplay
  const beginActiveGameplay = () => {
    setGameState('active');
    setTimeLeft(duration);

    // Spawn first target
    spawnTarget();

    // Start countdown clock
    const startTime = performance.now();
    timerIntervalRef.current = setInterval(() => {
      const elapsed = Math.floor((performance.now() - startTime) / 1000);
      const remaining = Math.max(duration - elapsed, 0);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        endTest();
      }
    }, 250);
  };

  // Target Spawner
  const spawnTarget = () => {
    if (!arenaRef.current) return;
    const rect = arenaRef.current.getBoundingClientRect();

    // Dimensions based on mode
    let targetSize = 54; // px
    let lifespan = 1600; // ms

    if (testMode === 'precision') {
      targetSize = 40;
      lifespan = 2000;
    } else if (testMode === 'speed') {
      targetSize = 60;
      lifespan = 1200;
    }

    const padding = targetSize + 20;
    const maxX = Math.max(rect.width - padding, 40);
    const maxY = Math.max(rect.height - padding, 40);

    const x = Math.floor(padding / 2 + Math.random() * (maxX - padding / 2));
    const y = Math.floor(padding / 2 + Math.random() * (maxY - padding / 2));

    const id = ++currentTargetIdRef.current;
    targetSpawnTimeRef.current = performance.now();

    setTotalSpawned(s => s + 1);
    setCurrentTarget({
      id,
      x,
      y,
      size: targetSize
    });

    // Handle target expiration if not hit in time
    clearTimeout(targetTimeoutRef.current);
    targetTimeoutRef.current = setTimeout(() => {
      handleTargetExpired(id);
    }, lifespan);
  };

  // Handle Target Expired
  const handleTargetExpired = (id) => {
    if (gameState !== 'active') return;
    setExpired(e => e + 1);
    soundFX.playMiss();
    spawnTarget();
  };

  // Handle Target Hit
  const handleTargetClick = (e) => {
    e.stopPropagation(); // prevent arena miss trigger
    if (gameState !== 'active' || !currentTarget) return;

    clearTimeout(targetTimeoutRef.current);

    const hitTime = performance.now();
    const reactionTime = Math.max(Math.round(hitTime - targetSpawnTimeRef.current), 50);

    // Audio & Visual feedback
    soundFX.playHit();
    setHitFeedback({
      x: currentTarget.x,
      y: currentTarget.y,
      text: `${reactionTime}ms`
    });
    setTimeout(() => setHitFeedback(null), 500);

    // Calculate score: Base points + speed bonus
    const speedBonus = Math.max(500 - reactionTime, 0);
    const addedScore = 100 + speedBonus;

    setHits(h => h + 1);
    setScore(s => s + addedScore);
    setTargetHistory(prev => [
      ...prev,
      {
        targetId: currentTarget.id,
        reactionTime,
        hit: true,
        x: currentTarget.x,
        y: currentTarget.y,
        size: currentTarget.size
      }
    ]);

    // Next target
    spawnTarget();
  };

  // Handle Arena Miss (Click outside active target)
  const handleArenaClick = (e) => {
    if (gameState !== 'active') return;
    soundFX.playMiss();
    setMisses(m => m + 1);
  };

  // End Test & Save
  const endTest = () => {
    clearInterval(timerIntervalRef.current);
    clearTimeout(targetTimeoutRef.current);
    setCurrentTarget(null);
    setGameState('finished');
  };

  // Clean up timers on unmount or tab switch
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && gameState === 'active') {
        endTest();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(timerIntervalRef.current);
      clearTimeout(targetTimeoutRef.current);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [gameState]);

  // When finished, compute metrics and redirect to results page
  useEffect(() => {
    if (gameState === 'finished') {
      const finalAccuracy = (hits + misses) > 0 ? Math.round((hits / (hits + misses)) * 100) : 0;
      const reactionTimes = targetHistory.map(t => t.reactionTime);
      const avgReaction = reactionTimes.length > 0 ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length) : 0;
      const bestReaction = reactionTimes.length > 0 ? Math.min(...reactionTimes) : 0;

      const resultPayload = {
        score,
        accuracy: finalAccuracy,
        avgReactionTime: avgReaction,
        bestReactionTime: bestReaction,
        totalSpawned,
        hits,
        misses,
        expired,
        duration,
        mode: testMode,
        targetBreakdown: targetHistory,
        game: activeConfig?.game || 'bgmi'
      };

      submitTestResult(resultPayload).then(() => {
        navigate('/test-results');
      });
    }
  }, [gameState]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Top Header & HUD */}
      <div className="bg-dark-900 border border-dark-750 rounded-2xl p-4 sm:p-6 shadow-card flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-purple/20 border border-brand-purple/40 flex items-center justify-center">
            <Crosshair className="w-5 h-5 text-brand-cyan" />
          </div>
          <div>
            <h1 className="font-gaming text-2xl font-bold text-white tracking-wide">
              AIMPRO TRAINING ARENA
            </h1>
            <p className="text-xs text-slate-400">
              Interactive target acquisition & reaction tester
            </p>
          </div>
        </div>

        {/* Live HUD Counters */}
        <div className="flex items-center gap-4 sm:gap-6 font-mono text-sm">
          <div className="bg-dark-950 px-3.5 py-1.5 rounded-xl border border-dark-800 text-center">
            <span className="text-[10px] text-slate-500 uppercase block">Time</span>
            <span className={`text-lg font-bold ${timeLeft <= 5 && gameState === 'active' ? 'text-red-400 animate-pulse' : 'text-white'}`}>
              {timeLeft}s
            </span>
          </div>

          <div className="bg-dark-950 px-3.5 py-1.5 rounded-xl border border-dark-800 text-center">
            <span className="text-[10px] text-slate-500 uppercase block">Score</span>
            <span className="text-lg font-bold text-brand-cyan">{score}</span>
          </div>

          <div className="bg-dark-950 px-3.5 py-1.5 rounded-xl border border-dark-800 text-center">
            <span className="text-[10px] text-slate-500 uppercase block">Hits / Miss</span>
            <span className="text-lg font-bold text-emerald-400">
              {hits} <span className="text-slate-500 font-normal">/</span> <span className="text-red-400">{misses}</span>
            </span>
          </div>

          <button
            onClick={toggleSound}
            className="p-2.5 rounded-xl bg-dark-850 hover:bg-dark-800 border border-dark-700 text-slate-300 transition-colors"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-brand-cyan" />}
          </button>
        </div>
      </div>

      {/* Mode & Duration Selector (When Idle) */}
      {gameState === 'idle' && (
        <div className="bg-dark-900/90 border border-dark-750 rounded-2xl p-6 shadow-card flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Training Drill Mode
              </label>
              <div className="flex rounded-xl bg-dark-950 p-1 border border-dark-800 text-xs font-semibold">
                {[
                  { id: 'reaction', label: 'Reaction Reflex' },
                  { id: 'precision', label: 'Precision Small Targets' },
                  { id: 'speed', label: 'Speed Blitz' }
                ].map(m => (
                  <button
                    key={m.id}
                    onClick={() => setTestMode(m.id)}
                    className={`px-3 py-1.5 rounded-lg transition-all ${testMode === m.id ? 'bg-brand-purple text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Session Duration
              </label>
              <div className="flex rounded-xl bg-dark-950 p-1 border border-dark-800 text-xs font-semibold">
                {[15, 30, 60].map(s => (
                  <button
                    key={s}
                    onClick={() => setDuration(s)}
                    className={`px-3.5 py-1.5 rounded-lg transition-all ${duration === s ? 'bg-brand-cyan text-dark-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                  >
                    {s}s
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={startTest}
            className="px-8 py-3.5 rounded-xl font-bold uppercase tracking-wider text-white bg-gradient-to-r from-brand-purple to-brand-cyan shadow-glow-purple hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>Start Aim Test</span>
          </button>
        </div>
      )}

      {/* Training Arena Container */}
      <div
        ref={arenaRef}
        onClick={handleArenaClick}
        className="aim-arena relative w-full h-[480px] sm:h-[540px] bg-dark-950 rounded-2xl border-2 border-dark-750 overflow-hidden shadow-2xl flex items-center justify-center select-none"
      >
        {/* Esports Crosshair Grid Overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-25 pointer-events-none" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="w-64 h-64 border border-brand-purple/40 rounded-full" />
          <div className="w-96 h-96 border border-brand-cyan/20 rounded-full" />
        </div>

        {/* Center Reticle Marker */}
        <div className="absolute w-2 h-2 rounded-full bg-brand-cyan/40 pointer-events-none" />

        {/* State: Idle Screen */}
        {gameState === 'idle' && (
          <div className="relative z-10 text-center max-w-md px-6 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-purple to-brand-cyan p-0.5 mx-auto shadow-glow-purple">
              <div className="w-full h-full bg-dark-950 rounded-[14px] flex items-center justify-center">
                <Target className="w-8 h-8 text-brand-cyan" />
              </div>
            </div>

            <div className="space-y-1">
              <h2 className="font-gaming text-3xl font-bold text-white tracking-wide">
                ARENA READY
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Targets will spawn across the arena. Click or tap them as swiftly and accurately as possible. Clicks outside active targets are recorded as misses.
              </p>
            </div>

            <button
              onClick={startTest}
              className="px-8 py-3 rounded-xl font-bold uppercase tracking-wider text-white bg-gradient-to-r from-brand-purple to-brand-purple-hover shadow-glow-purple hover:opacity-95 transition-all inline-flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Begin Drill ({duration}s)</span>
            </button>
          </div>
        )}

        {/* State: Countdown Screen */}
        {gameState === 'countdown' && (
          <div className="relative z-10 flex flex-col items-center justify-center space-y-2 pointer-events-none">
            <span className="font-gaming text-8xl font-black text-transparent bg-clip-text bg-gradient-to-tr from-brand-purple to-brand-cyan animate-pulse">
              {countdown}
            </span>
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Get Ready to Flick
            </span>
          </div>
        )}

        {/* State: Active Target Spawning */}
        {gameState === 'active' && currentTarget && (
          <button
            key={currentTarget.id}
            onClick={handleTargetClick}
            style={{
              top: `${currentTarget.y}px`,
              left: `${currentTarget.x}px`,
              width: `${currentTarget.size}px`,
              height: `${currentTarget.size}px`
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full p-1 bg-gradient-to-tr from-brand-purple via-brand-cyan to-white shadow-glow-cyan transition-transform transform active:scale-90 hover:scale-105"
          >
            <div className="w-full h-full rounded-full bg-dark-950 flex items-center justify-center relative">
              {/* Pulsing center dot */}
              <div className="w-3.5 h-3.5 rounded-full bg-brand-cyan animate-ping opacity-75" />
              <div className="absolute w-2.5 h-2.5 rounded-full bg-white shadow-sm" />
            </div>
          </button>
        )}

        {/* Visual Floating Hit Ripple Feedback */}
        {hitFeedback && (
          <div
            style={{ top: `${hitFeedback.y}px`, left: `${hitFeedback.x}px` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20 font-mono text-xs font-bold text-emerald-400 animate-bounce"
          >
            +{hitFeedback.text}
          </div>
        )}
      </div>

      {/* Browser Aim Test Context Disclaimer */}
      <div className="bg-dark-900/60 border border-dark-750 rounded-xl p-4 flex items-start gap-3 text-xs text-slate-400 leading-relaxed">
        <AlertCircle className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" />
        <p>
          <strong className="text-slate-300">Methodology Note:</strong> This browser-based aim test measures your raw target acquisition, flick precision, and reaction performance on this display. It does not measure physical in-game weapon recoil or real weapon bloom. The results diagnose whether your sensitivity causes overshooting or undershooting.
        </p>
      </div>
    </div>
  );
}

