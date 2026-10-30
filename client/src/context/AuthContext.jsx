import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('aimpro_token') || null);
  const [loading, setLoading] = useState(true);

  // Load existing session on initial mount
  useEffect(() => {
    async function loadSession() {
      const savedToken = localStorage.getItem('aimpro_token');
      const savedUser = localStorage.getItem('aimpro_user');

      if (savedToken && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          setToken(savedToken);

          // Attempt to verify with backend if token is not guest
          if (!savedToken.startsWith('guest_')) {
            const res = await fetch('/api/auth/me', {
              headers: { Authorization: `Bearer ${savedToken}` }
            });
            if (res.ok) {
              const data = await res.json();
              setUser(data.user);
              localStorage.setItem('aimpro_user', JSON.stringify(data.user));
            } else if (res.status === 401) {
              logout();
            }
          }
        } catch (e) {
          console.error('Session restore error:', e);
        }
      }
      setLoading(false);
    }
    loadSession();
  }, []);

  const login = async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('aimpro_token', data.token);
    localStorage.setItem('aimpro_user', JSON.stringify(data.user));
    return data.user;
  };

  const register = async (username, email, password) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Registration failed');
    }
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('aimpro_token', data.token);
    localStorage.setItem('aimpro_user', JSON.stringify(data.user));
    return data.user;
  };

  const continueAsGuest = async () => {
    try {
      const res = await fetch('/api/auth/guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('aimpro_token', data.token);
        localStorage.setItem('aimpro_user', JSON.stringify(data.user));
        return data.user;
      }
    } catch (e) {
      console.warn('Backend unavailable, generating local guest');
    }

    // Fallback purely local guest
    const guestId = 'guest_' + Math.random().toString(36).substring(2, 9);
    const guestUser = {
      id: guestId,
      username: `Guest_${guestId.substring(6, 11).toUpperCase()}`,
      email: `${guestId}@aimpro.local`,
      isGuest: true
    };
    setToken(guestId);
    setUser(guestUser);
    localStorage.setItem('aimpro_token', guestId);
    localStorage.setItem('aimpro_user', JSON.stringify(guestUser));
    return guestUser;
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {}
    setToken(null);
    setUser(null);
    localStorage.removeItem('aimpro_token');
    localStorage.removeItem('aimpro_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isGuest: !!user?.isGuest,
        login,
        register,
        continueAsGuest,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

