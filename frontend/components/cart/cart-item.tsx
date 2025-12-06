'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartItem as CartItemType } from '@/types/cart';
import { useCart } from '@/lib/hooks/use-cart';
import { toast } from 'sonner';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const maxQuantity = Math.min(item.product.stock, 99);
  const itemTotal = Number(item.product.price) * item.quantity;

  const handleDecrement = async () => {
    if (item.quantity <= 1 || isUpdating) return;

    setIsUpdating(true);
    try {
      await updateQuantity(item.id, item.quantity - 1);
    } catch (error) {
      toast.error('Failed to update quantity');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleIncrement = async () => {
    if (item.quantity >= maxQuantity || isUpdating) return;

    setIsUpdating(true);
    try {
      await updateQuantity(item.id, item.quantity + 1);
    } catch (error) {
      toast.error('Failed to update quantity');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    if (isRemoving) return;

    setIsRemoving(true);
    try {
      await removeItem(item.id);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
      setIsRemoving(false);
    }
  };

  return (
    <div className="flex gap-4 py-4 border-b last:border-b-0">
      {/* Product Image */}
      <Link
        href={`/products/${item.productId}`}
        className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-muted"
      >
        {item.product.imageUrl ? (
          <Image
            src={item.product.imageUrl}
            alt={item.product.name}
            fill
            className="object-cover"
            sizes="96px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
            No image
          </div>
        )}
      </Link>

      {/* Product Details */}
      <div className="flex flex-1 flex-col">
        <div className="flex justify-between">
          <div className="flex-1 pr-4">
            <Link
              href={`/products/${item.productId}`}
              className="font-medium hover:underline line-clamp-2"
            >
              {item.product.name}
            </Link>
            <p className="text-sm text-muted-foreground mt-1">{item.product.category.name}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold">${itemTotal.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">
              ${Number(item.product.price).toFixed(2)} each
            </p>
          </div>
        </div>

        {/* Quantity Controls & Remove */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleDecrement}
              disabled={item.quantity <= 1 || isUpdating}
              className="h-8 w-8"
            >
              {isUpdating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Minus className="h-4 w-4" />
              )}
              <span className="sr-only">Decrease quantity</span>
            </Button>
            <span className="w-8 text-center font-medium">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={handleIncrement}
              disabled={item.quantity >= maxQuantity || isUpdating}
              className="h-8 w-8"
            >
              {isUpdating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              <span className="sr-only">Increase quantity</span>
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            disabled={isRemoving}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            {isRemoving ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Trash2 className="h-4 w-4 mr-2" />
            )}
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
}
