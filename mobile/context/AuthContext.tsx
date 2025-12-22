import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { storage } from '@/lib/storage';
import * as api from '@/lib/api';
import type { User, AuthResponse } from '@/lib/api/auth';

const REFRESH_TOKEN_KEY = 'trove_refresh_token';
const TOKEN_REFRESH_MARGIN = 60 * 1000; // Refresh 1 minute before expiry

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  login: (email: string, password: string, sessionId?: string | null) => Promise<AuthResponse>;
  register: (email: string, password: string, name: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  updateUser: (data: { name: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sessionRestoreAttempted = useRef(false);

  const clearRefreshTimeout = useCallback(() => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
      refreshTimeoutRef.current = null;
    }
  }, []);

  const scheduleTokenRefresh = useCallback(
    (expiresIn: number) => {
      clearRefreshTimeout();

      // Schedule refresh 1 minute before expiry (or immediately if less than 1 min)
      const refreshTime = Math.max(0, expiresIn * 1000 - TOKEN_REFRESH_MARGIN);

      refreshTimeoutRef.current = setTimeout(async () => {
        try {
          const storedRefreshToken = await storage.getItem(REFRESH_TOKEN_KEY);
          if (!storedRefreshToken) {
            return;
          }

          const tokens = await api.refreshTokens(storedRefreshToken);
          setAccessToken(tokens.accessToken);

          // Store new refresh token
          await storage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);

          // Schedule next refresh
          scheduleTokenRefresh(tokens.expiresIn);
        } catch (error) {
          console.error('Token refresh failed:', error);
          // Clear auth state on refresh failure
          setUser(null);
          setAccessToken(null);
          await storage.deleteItem(REFRESH_TOKEN_KEY);
        }
      }, refreshTime);
    },
    [clearRefreshTimeout]
  );

  // Restore session on mount - only run once
  useEffect(() => {
    // Prevent multiple restore attempts
    if (sessionRestoreAttempted.current) {
      return;
    }
    sessionRestoreAttempted.current = true;

    const restoreSession = async () => {
      try {
        const storedRefreshToken = await storage.getItem(REFRESH_TOKEN_KEY);

        if (!storedRefreshToken) {
          setIsLoading(false);
          return;
        }

        // Try to refresh tokens
        const tokens = await api.refreshTokens(storedRefreshToken);
        setAccessToken(tokens.accessToken);

        // Store new refresh token
        await storage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);

        // Get user profile
        const userData = await api.getProfile(tokens.accessToken);
        setUser(userData);

        // Schedule token refresh
        scheduleTokenRefresh(tokens.expiresIn);
      } catch (error) {
        console.error('Session restore failed:', error);
        // Clear stored refresh token on error
        await storage.deleteItem(REFRESH_TOKEN_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();

    return () => {
      clearRefreshTimeout();
    };
  }, []);

  const login = useCallback(
    async (email: string, password: string, sessionId?: string | null): Promise<AuthResponse> => {
      const response = await api.login({ email, password, sessionId });

      setUser(response.user);
      setAccessToken(response.accessToken);

      // Store refresh token securely
      await storage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);

      // Schedule token refresh
      scheduleTokenRefresh(response.expiresIn);

      return response;
    },
    [scheduleTokenRefresh]
  );

  const register = useCallback(
    async (email: string, password: string, name: string): Promise<AuthResponse> => {
      const response = await api.register({ email, password, name });

      setUser(response.user);
      setAccessToken(response.accessToken);

      // Store refresh token securely
      await storage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);

      // Schedule token refresh
      scheduleTokenRefresh(response.expiresIn);

      return response;
    },
    [scheduleTokenRefresh]
  );

  const logout = useCallback(async () => {
    clearRefreshTimeout();

    try {
      const storedRefreshToken = await storage.getItem(REFRESH_TOKEN_KEY);
      if (accessToken && storedRefreshToken) {
        await api.logout(accessToken, storedRefreshToken);
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
    }

    // Clear state
    setUser(null);
    setAccessToken(null);
    await storage.deleteItem(REFRESH_TOKEN_KEY);
  }, [accessToken, clearRefreshTimeout]);

  const updateUser = useCallback(
    async (data: { name: string }) => {
      if (!accessToken) {
        throw new Error('Not authenticated');
      }

      const updatedUser = await api.updateProfile(accessToken, data);
      setUser(updatedUser);
    },
    [accessToken]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        accessToken,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
