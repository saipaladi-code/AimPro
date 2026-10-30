import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SensitivityProvider } from './context/SensitivityContext';
import { AimTestProvider } from './context/AimTestContext';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import HomePage from './pages/HomePage';
import OnboardingPage from './pages/OnboardingPage';
import SensitivityPage from './pages/SensitivityPage';
import AimTestPage from './pages/AimTestPage';
import TestResultsPage from './pages/TestResultsPage';
import AdjustmentsPage from './pages/AdjustmentsPage';
import DashboardPage from './pages/DashboardPage';
import GuidesPage from './pages/GuidesPage';
import AuthPage from './pages/AuthPage';

export default function App() {
  return (
    <AuthProvider>
      <SensitivityProvider>
        <AimTestProvider>
          <Router>
            <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col font-sans selection:bg-brand-purple/30 selection:text-white">
              <Navbar />

              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/onboarding" element={<OnboardingPage />} />
                  <Route path="/sensitivity" element={<SensitivityPage />} />
                  <Route path="/aim-test" element={<AimTestPage />} />
                  <Route path="/test-results" element={<TestResultsPage />} />
                  <Route path="/adjustments" element={<AdjustmentsPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/guides" element={<GuidesPage />} />
                  <Route path="/auth" element={<AuthPage />} />

                  {/* Catch-all redirect to Home */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>

              <Footer />
            </div>
          </Router>
        </AimTestProvider>
      </SensitivityProvider>
    </AuthProvider>
  );
}
