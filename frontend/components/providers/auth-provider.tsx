'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import * as authApi from '@/lib/api/auth';
import type { User, AuthResponse } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  accessToken: string | null;
  login: (email: string, password: string, sessionId?: string) => Promise<AuthResponse>;
  register: (email: string, password: string, name: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  updateUser: (data: { name?: string }) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const REFRESH_TOKEN_KEY = 'trove_refresh_token';
// Refresh token 1 minute before expiry (14 min for 15 min token)
const TOKEN_REFRESH_INTERVAL = 14 * 60 * 1000;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // Clear any scheduled refresh
  const clearRefreshTimeout = useCallback(() => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
      refreshTimeoutRef.current = null;
    }
  }, []);

  // Handle logout
  const handleLogout = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    clearRefreshTimeout();
  }, [clearRefreshTimeout]);

  // Schedule token refresh
  const scheduleTokenRefresh = useCallback(() => {
    clearRefreshTimeout();

    refreshTimeoutRef.current = setTimeout(async () => {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (refreshToken) {
        try {
          const tokens = await authApi.refreshTokens(refreshToken);
          setAccessToken(tokens.accessToken);
          localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
          scheduleTokenRefresh();
        } catch {
          // Refresh failed, logout
          handleLogout();
        }
      }
    }, TOKEN_REFRESH_INTERVAL);
  }, [clearRefreshTimeout, handleLogout]);

  // Restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

      if (!refreshToken) {
        setIsLoading(false);
        return;
      }

      try {
        // Get new tokens
        const tokens = await authApi.refreshTokens(refreshToken);
        setAccessToken(tokens.accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);

        // Get user profile
        const profile = await authApi.getProfile(tokens.accessToken);
        setUser(profile);

        // Schedule next refresh
        scheduleTokenRefresh();
      } catch {
        // Session restore failed, clear tokens
        handleLogout();
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();

    return () => {
      clearRefreshTimeout();
    };
  }, [scheduleTokenRefresh, handleLogout, clearRefreshTimeout]);

  // Login
  const login = useCallback(
    async (email: string, password: string, sessionId?: string): Promise<AuthResponse> => {
      const response = await authApi.login({ email, password, sessionId });

      setUser(response.user);
      setAccessToken(response.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
      scheduleTokenRefresh();

      return response;
    },
    [scheduleTokenRefresh]
  );

  // Register
  const register = useCallback(
    async (email: string, password: string, name: string): Promise<AuthResponse> => {
      const response = await authApi.register({ email, password, name });

      setUser(response.user);
      setAccessToken(response.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
      scheduleTokenRefresh();

      return response;
    },
    [scheduleTokenRefresh]
  );

  // Logout
  const logout = useCallback(async () => {
    if (accessToken) {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (refreshToken) {
        await authApi.logout(accessToken, refreshToken);
      }
    }
    handleLogout();
    router.push('/');
  }, [accessToken, handleLogout, router]);

  // Update user profile
  const updateUser = useCallback(
    async (data: { name?: string }): Promise<User> => {
      if (!accessToken) {
        throw new Error('Not authenticated');
      }

      const updatedUser = await authApi.updateProfile(accessToken, data);
      setUser(updatedUser);
      return updatedUser;
    },
    [accessToken]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
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
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
