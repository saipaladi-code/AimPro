import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Crosshair, Target, Sliders, BarChart2, BookOpen, User, LogOut, Menu, X, ShieldAlert, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isGuest, logout } = useAuth();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Sensitivity Engine', path: '/sensitivity', icon: Sliders },
    { label: 'Aim Arena', path: '/aim-test', icon: Crosshair },
    { label: 'Tuning Suggestions', path: '/adjustments', icon: Zap },
    { label: 'Analytics', path: '/dashboard', icon: BarChart2 },
    { label: 'Guides', path: '/guides', icon: BookOpen },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-dark-950/85 backdrop-blur-md border-b border-dark-700/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-purple to-brand-cyan flex items-center justify-center p-0.5 shadow-glow-purple transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-dark-950 rounded-[10px] flex items-center justify-center">
                <Crosshair className="w-5 h-5 text-brand-cyan group-hover:text-brand-purple-light transition-colors" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-gaming text-2xl font-bold tracking-wider text-white flex items-center gap-1">
                AIM<span className="text-brand-purple">PRO</span>
                <span className="text-[10px] uppercase font-sans font-semibold tracking-widest bg-brand-purple/20 text-brand-purple-light px-1.5 py-0.5 rounded border border-brand-purple/30">
                  Esports
                </span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((item) => {
              const active = isActive(item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                    active
                      ? 'bg-dark-800 text-white border border-brand-purple/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-dark-850'
                  }`}
                >
                  {Icon && <Icon className={`w-4 h-4 ${active ? 'text-brand-cyan' : 'text-slate-500'}`} />}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action & User Profile */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-850 border border-dark-700">
                  <div className={`w-2 h-2 rounded-full ${isGuest ? 'bg-amber-400' : 'bg-emerald-400'} animate-pulse`} />
                  <span className="text-xs font-medium text-slate-300">
                    {user.username}
                  </span>
                  {isGuest && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                      Guest
                    </span>
                  )}
                </div>

                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-dark-800 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/auth"
                  className="px-3.5 py-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/onboarding"
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-brand-purple to-brand-purple-hover text-white shadow-glow-purple hover:opacity-95 transition-all transform hover:-translate-y-0.5"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white rounded-lg focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-dark-900 border-b border-dark-700 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  active
                    ? 'bg-brand-purple/20 text-white border border-brand-purple/40'
                    : 'text-slate-300 hover:bg-dark-800'
                }`}
              >
                {Icon && <Icon className="w-4 h-4 text-brand-cyan" />}
                {item.label}
              </Link>
            );
          })}

          <div className="pt-4 border-t border-dark-700 flex flex-col gap-2">
            {user ? (
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isGuest ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                  <span className="text-sm font-medium text-slate-200">{user.username}</span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-red-400 hover:underline flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" /> Log Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 rounded-lg text-sm font-medium bg-dark-800 text-slate-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/onboarding"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 rounded-lg text-sm font-semibold bg-brand-purple text-white shadow-glow-purple"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

