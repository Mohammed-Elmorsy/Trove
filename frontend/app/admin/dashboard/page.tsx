'use client';

import { useEffect, useState } from 'react';
import { Package, ShoppingCart, DollarSign, Clock, AlertTriangle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getDashboardStats } from '@/lib/admin-api';
import type { DashboardStats } from '@/types/admin';
import { AdminAuthGuard } from '@/components/admin/admin-auth-guard';

export default function DashboardPage() {
  return (
    <AdminAuthGuard>
      <DashboardContent />
    </AdminAuthGuard>
  );
}

function DashboardContent() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Total Products" value={stats?.totalProducts ?? 0} icon={Package} />
        <StatCard title="Total Orders" value={stats?.totalOrders ?? 0} icon={ShoppingCart} />
        <StatCard
          title="Total Revenue"
          value={`$${(stats?.totalRevenue ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={DollarSign}
        />
        <StatCard title="Pending Orders" value={stats?.ordersByStatus?.pending ?? 0} icon={Clock} />
        <StatCard
          title="Low Stock Items"
          value={stats?.lowStockProducts ?? 0}
          icon={AlertTriangle}
          variant={stats?.lowStockProducts && stats.lowStockProducts > 0 ? 'warning' : 'default'}
        />
        <StatCard title="Orders (24h)" value={stats?.recentOrdersCount ?? 0} icon={TrendingUp} />
      </div>

      {/* Orders by Status */}
      <Card>
        <CardHeader>
          <CardTitle>Orders by Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(stats?.ordersByStatus ?? {}).length > 0 ? (
              Object.entries(stats?.ordersByStatus ?? {}).map(([status, count]) => (
                <div key={status} className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-sm text-muted-foreground capitalize">{status}</p>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-muted-foreground py-4">No orders yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  variant = 'default',
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  variant?: 'default' | 'warning';
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <div
            className={`h-12 w-12 rounded-full flex items-center justify-center ${
              variant === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/20' : 'bg-primary/10'
            }`}
          >
            <Icon
              className={`h-6 w-6 ${
                variant === 'warning' ? 'text-yellow-600 dark:text-yellow-400' : 'text-primary'
              }`}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-48" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-28" />
        ))}
      </div>
      <Skeleton className="h-48" />
    </div>
  );
}
