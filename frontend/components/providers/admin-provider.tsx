'use client';

import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from './auth-provider';

interface AdminContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  accessToken: string | null;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, isLoading, accessToken } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isAdmin = isAuthenticated && user?.role === 'ADMIN';

  useEffect(() => {
    if (isLoading) return;

    // If not authenticated, redirect to main login
    if (!isAuthenticated) {
      router.push('/login?redirect=' + encodeURIComponent(pathname));
      return;
    }

    // If authenticated but not admin, redirect to home
    if (!isAdmin) {
      router.push('/');
    }
  }, [isLoading, isAuthenticated, isAdmin, pathname, router]);

  return (
    <AdminContext.Provider value={{ isAuthenticated, isAdmin, isLoading, accessToken }}>
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
