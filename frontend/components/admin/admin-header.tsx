'use client';

import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdmin } from '@/components/providers/admin-provider';

export function AdminHeader() {
  const { isAuthenticated } = useAdmin();

  if (!isAuthenticated) return null;

  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-6">
      <h2 className="text-lg font-medium">Admin Panel</h2>
      <Button variant="outline" size="sm" asChild>
        <Link href="/" target="_blank">
          <ExternalLink className="h-4 w-4 mr-2" />
          View Store
        </Link>
      </Button>
    </header>
  );
}
