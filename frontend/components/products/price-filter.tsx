'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface PriceFilterProps {
  minPrice?: string;
  maxPrice?: string;
  search?: string;
  categoryId?: string;
}

export function PriceFilter({
  minPrice = '',
  maxPrice = '',
  search,
  categoryId,
}: PriceFilterProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [min, setMin] = useState(minPrice);
  const [max, setMax] = useState(maxPrice);

  const buildUrl = (newMin?: string, newMax?: string) => {
    const params = new URLSearchParams();

    if (search) {
      params.set('search', search);
    }
    if (categoryId) {
      params.set('categoryId', categoryId);
    }
    if (newMin) {
      params.set('minPrice', newMin);
    }
    if (newMax) {
      params.set('maxPrice', newMax);
    }

    return `/products?${params.toString()}`;
  };

  const handleApply = () => {
    // Validate that min <= max
    const minValue = parseFloat(min);
    const maxValue = parseFloat(max);

    if (min && max && minValue > maxValue) {
      alert('Minimum price cannot be greater than maximum price');
      return;
    }

    startTransition(() => {
      router.push(buildUrl(min, max));
    });
  };

  const handleClear = () => {
    setMin('');
    setMax('');
    startTransition(() => {
      router.push(buildUrl());
    });
  };

  return (
    <div className="space-y-4" role="group" aria-label="Filter by price range">
      <div className="space-y-2">
        <Label htmlFor="minPrice">Min Price</Label>
        <Input
          id="minPrice"
          type="number"
          placeholder="0"
          min="0"
          step="0.01"
          value={min}
          onChange={(e) => setMin(e.target.value)}
          aria-label="Minimum price"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="maxPrice">Max Price</Label>
        <Input
          id="maxPrice"
          type="number"
          placeholder="1000"
          min="0"
          step="0.01"
          value={max}
          onChange={(e) => setMax(e.target.value)}
          aria-label="Maximum price"
        />
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleApply}
          className="flex-1"
          disabled={isPending}
          aria-label="Apply price filter"
        >
          Apply
        </Button>
        {(min || max) && (
          <Button
            onClick={handleClear}
            variant="outline"
            className="flex-1"
            disabled={isPending}
            aria-label="Clear price filter"
          >
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
