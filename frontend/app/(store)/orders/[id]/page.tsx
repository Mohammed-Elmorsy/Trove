import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Package, Truck, MapPin, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PageBreadcrumb } from '@/components/layout/page-breadcrumb';
import { getOrder } from '@/lib/api';

interface OrderPageProps {
  params: Promise<{ id: string }>;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default async function OrderPage({ params }: OrderPageProps) {
  const { id } = await params;

  let order;
  try {
    order = await getOrder(id);
  } catch {
    notFound();
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <PageBreadcrumb
          items={[{ label: 'Orders', href: '/orders' }, { label: order.orderNumber }]}
        />

        {/* Success Message */}
        <div className="flex items-center gap-3 mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
          <div>
            <h1 className="text-2xl font-bold text-green-800">Order Confirmed!</h1>
            <p className="text-green-700">
              Thank you for your order. We&apos;ve sent a confirmation to{' '}
              {order.shippingAddress.email}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Info */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Order {order.orderNumber}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Placed on {formatDate(order.createdAt)}
                  </p>
                </div>
                <Badge className={statusColors[order.status] || 'bg-gray-100 text-gray-800'}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-muted-foreground">
                          ${item.productPrice.toFixed(2)} x {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">${item.subtotal.toFixed(2)}</p>
                    </div>
                  ))}

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>
                        {order.shippingCost === 0 ? (
                          <span className="text-green-600">Free</span>
                        ) : (
                          `$${order.shippingCost.toFixed(2)}`
                        )}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{order.shippingAddress.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.shippingAddress.address}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                        {order.shippingAddress.zipCode}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{order.shippingAddress.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{order.shippingAddress.phone}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>What&apos;s Next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Your order is being processed. You&apos;ll receive an email when your order ships.
                </p>
                <div className="space-y-2">
                  <Button asChild className="w-full">
                    <Link href="/products">Continue Shopping</Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/orders">View All Orders</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
