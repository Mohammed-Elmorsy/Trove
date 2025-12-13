'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAdminAuthenticated, logoutAdmin, validateAdminSecret } from '@/lib/admin-api';

interface AdminContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (secret: string) => Promise<boolean>;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check authentication status on mount
    const authenticated = isAdminAuthenticated();
    setIsAuthenticated(authenticated);
    setIsLoading(false);

    // Redirect to login if not authenticated and not already on login page
    if (!authenticated && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [pathname, router]);

  const login = useCallback(async (secret: string): Promise<boolean> => {
    const valid = await validateAdminSecret(secret);
    setIsAuthenticated(valid);
    return valid;
  }, []);

  const logout = useCallback(() => {
    logoutAdmin();
    setIsAuthenticated(false);
    router.push('/admin/login');
  }, [router]);

  return (
    <AdminContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
