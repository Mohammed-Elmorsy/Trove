'use client';

import { useState } from 'react';
import { Minus, Plus, ShoppingCart, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/hooks/use-cart';
import { toast } from 'sonner';

interface AddToCartButtonProps {
  productId: string;
  productName: string;
  stock: number;
  maxQuantity?: number;
}

export function AddToCartButton({
  productId,
  productName,
  stock,
  maxQuantity = 10,
}: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { addItem } = useCart();

  const isOutOfStock = stock === 0;
  const effectiveMax = Math.min(maxQuantity, stock);

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < effectiveMax) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleAddToCart = async () => {
    if (isOutOfStock || isLoading) return;

    setIsLoading(true);
    try {
      await addItem(productId, quantity);

      // Show success state on button
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);

      // Show toast notification
      toast.success('Added to cart!', {
        description: `${quantity} x ${productName}`,
      });

      // Reset quantity after adding
      setQuantity(1);
    } catch (error) {
      toast.error('Failed to add to cart', {
        description: error instanceof Error ? error.message : 'Please try again',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isOutOfStock) {
    return (
      <Button disabled className="w-full" size="lg">
        Out of Stock
      </Button>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Quantity Selector */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-muted-foreground">Quantity:</span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleDecrement}
            disabled={quantity <= 1 || isLoading}
            className="h-9 w-9"
          >
            <Minus className="h-4 w-4" />
            <span className="sr-only">Decrease quantity</span>
          </Button>
          <span className="w-12 text-center text-lg font-semibold">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={handleIncrement}
            disabled={quantity >= effectiveMax || isLoading}
            className="h-9 w-9"
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">Increase quantity</span>
          </Button>
        </div>
        {stock <= 10 && <span className="text-sm text-amber-600">Only {stock} left</span>}
      </div>

      {/* Add to Cart Button */}
      <Button
        onClick={handleAddToCart}
        disabled={isLoading}
        size="lg"
        className="w-full"
        variant={showSuccess ? 'default' : 'default'}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Adding...
          </>
        ) : showSuccess ? (
          <>
            <Check className="mr-2 h-5 w-5" />
            Added!
          </>
        ) : (
          <>
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
          </>
        )}
      </Button>
    </div>
  );
}
