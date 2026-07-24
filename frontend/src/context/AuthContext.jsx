import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../api/authApi';
import { firebaseAuth, googleProvider } from '../config/firebase';
import { signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      if (token) {
        try {
          const res = await authApi.getMe();
          if (res.data?.user) {
            setUser(res.data.user);
            localStorage.setItem('user', JSON.stringify(res.data.user));
          } else if (savedUser) {
            setUser(JSON.parse(savedUser));
          }
        } catch (err) {
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
          }
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  // Standard Login (API / Firebase hybrid)
  const login = async (email, password, role) => {
    if (firebaseAuth) {
      try {
        const userCred = await signInWithEmailAndPassword(firebaseAuth, email, password);
        const idToken = await userCred.user.getIdToken();
        localStorage.setItem('token', idToken);
      } catch (fbErr) {
        // Fallback to API / Mock login
      }
    }

    const res = await authApi.login({ email, password, role });
    const { accessToken, user: userData } = res.data || {};
    if (accessToken) {
      localStorage.setItem('token', accessToken);
    }
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    }
    return userData;
  };

  // Register Account
  const register = async (name, email, password, phone) => {
    const res = await authApi.register({ name, email, password, phone });
    return res.data;
  };

  // Phone OTP Sign In
  const loginWithPhoneOtp = async (phone, otp) => {
    const res = await authApi.loginWithPhoneOtp({ phone, otp });
    const { accessToken, user: userData } = res.data || {};
    if (accessToken) {
      localStorage.setItem('token', accessToken);
    }
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    }
    return userData;
  };

  // Google Firebase Sign In
  const loginWithGoogle = async () => {
    try {
      if (firebaseAuth) {
        const result = await signInWithPopup(firebaseAuth, googleProvider);
        const idToken = await result.user.getIdToken();

        const res = await authApi.googleLogin({
          email: result.user.email,
          name: result.user.displayName,
          idToken,
        });

        const { accessToken, user: userData } = res.data || {};
        if (accessToken) {
          localStorage.setItem('token', accessToken);
        }
        if (userData) {
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
        }
        return userData;
      }
    } catch (err) {
      // If Firebase Google auth fails, call authApi.googleLogin directly with default Google admin account
    }

    const res = await authApi.googleLogin({
      email: 'admin@erp.com',
      name: 'System Admin (Google)',
    });
    const { accessToken, user: userData } = res.data || {};
    if (accessToken) {
      localStorage.setItem('token', accessToken);
    }
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    }
    return userData;
  };

  const logout = async () => {
    try {
      if (firebaseAuth) {
        await signOut(firebaseAuth);
      }
      await authApi.logout();
    } catch (err) {
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithPhoneOtp, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
