import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useSensitivity } from './SensitivityContext';

const AimTestContext = createContext();

export function AimTestProvider({ children }) {
  const { token } = useAuth();
  const { activeConfig } = useSensitivity();

  const [lastResult, setLastResult] = useState(() => {
    const saved = localStorage.getItem('aimpro_last_test');
    return saved ? JSON.parse(saved) : null;
  });

  const [testHistory, setTestHistory] = useState([]);
  const [testStats, setTestStats] = useState({
    totalTests: 0,
    avgAccuracy: 0,
    avgReaction: 0,
    bestScore: 0,
    bestReaction: 0
  });

  const [suggestedAdjustments, setSuggestedAdjustments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      loadHistory();
    }
  }, [token]);

  const loadHistory = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/aim-test/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTestHistory(data.history || []);
        if (data.stats) setTestStats(data.stats);
      }
    } catch (e) {
      console.warn('Could not fetch test history:', e);
    }
  };

  const submitTestResult = async (resultData) => {
    setLoading(true);
    const payload = {
      ...resultData,
      configId: activeConfig?._id || activeConfig?.id || null,
      game: activeConfig?.game || 'bgmi',
      createdAt: new Date().toISOString()
    };

    setLastResult(payload);
    localStorage.setItem('aimpro_last_test', JSON.stringify(payload));

    if (token) {
      try {
        const res = await fetch('/api/aim-test/results', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const data = await res.json();
          if (data.recommendedAdjustments) {
            setSuggestedAdjustments(data.recommendedAdjustments);
          }
          await loadHistory();
          setLoading(false);
          return data;
        }
      } catch (e) {
        console.warn('Failed to save test result to server:', e);
      }
    }

    // Local fallback calculation for adjustments
    setTestHistory(prev => [payload, ...prev]);
    setLoading(false);
    return { result: payload, recommendedAdjustments: [] };
  };

  return (
    <AimTestContext.Provider
      value={{
        lastResult,
        setLastResult,
        testHistory,
        testStats,
        suggestedAdjustments,
        setSuggestedAdjustments,
        submitTestResult,
        loadHistory,
        loading
      }}
    >
      {children}
    </AimTestContext.Provider>
  );
}

export function useAimTest() {
  return useContext(AimTestContext);
}

