import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Crosshair, User, Lock, Mail, ArrowRight, ShieldCheck,
  AlertCircle, Sparkles, CheckCircle2, UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, continueAsGuest } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(username, email, password);
      }
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = async () => {
    setLoading(true);
    try {
      await continueAsGuest();
      navigate('/onboarding');
    } catch (err) {
      setError('Could not start guest session.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-dark-900 border border-dark-750 rounded-2xl p-6 sm:p-8 shadow-card space-y-6">
        {/* Logo & Heading */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-purple to-brand-cyan p-0.5 mx-auto shadow-glow-purple">
            <div className="w-full h-full bg-dark-950 rounded-[14px] flex items-center justify-center">
              <Crosshair className="w-6 h-6 text-brand-cyan" />
            </div>
          </div>
          <h1 className="font-gaming text-2xl sm:text-3xl font-bold text-white tracking-wide">
            {mode === 'login' ? 'WELCOME BACK' : 'CREATE AIMPRO ACCOUNT'}
          </h1>
          <p className="text-xs text-slate-400">
            {mode === 'login'
              ? 'Sign in to access your cloud-synced sensitivity profiles'
              : 'Save your aim test logs and customize pro configurations'}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex rounded-xl bg-dark-950 p-1 border border-dark-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            className={`w-1/2 py-2 rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-brand-purple text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(null); }}
            className={`w-1/2 py-2 rounded-lg transition-all ${
              mode === 'register'
                ? 'bg-brand-purple text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Gamer Handle / Username</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g., Jonathan_Sniper"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-dark-850 border border-dark-700 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-purple placeholder-slate-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="player@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-dark-850 border border-dark-700 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-purple placeholder-slate-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-dark-850 border border-dark-700 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-purple placeholder-slate-500"
              />
            </div>
            {mode === 'register' && (
              <span className="text-[11px] text-slate-500 mt-1 block">Minimum 6 characters</span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold uppercase tracking-wider text-white bg-gradient-to-r from-brand-purple to-brand-purple-hover shadow-glow-purple hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-dark-800 w-full" />
          <span className="bg-dark-900 px-3 text-[11px] uppercase tracking-wider text-slate-500 font-mono">
            or continue without account
          </span>
          <div className="border-t border-dark-800 w-full" />
        </div>

        {/* Continue as Guest Button */}
        <button
          type="button"
          onClick={handleGuest}
          disabled={loading}
          className="w-full py-2.5 rounded-xl font-semibold text-xs text-slate-300 bg-dark-850 hover:bg-dark-800 border border-dark-700 hover:border-brand-cyan/40 transition-all flex items-center justify-center gap-2"
        >
          <UserCheck className="w-4 h-4 text-amber-400" />
          <span>Continue as Guest (Instant Access)</span>
        </button>
      </div>
    </div>
  );
}

