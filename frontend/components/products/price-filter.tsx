'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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
    <div className="space-y-4">
      <div>
        <label htmlFor="minPrice" className="text-sm text-gray-600 block mb-1">
          Min Price
        </label>
        <Input
          id="minPrice"
          type="number"
          placeholder="0"
          min="0"
          step="0.01"
          value={min}
          onChange={(e) => setMin(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="maxPrice" className="text-sm text-gray-600 block mb-1">
          Max Price
        </label>
        <Input
          id="maxPrice"
          type="number"
          placeholder="1000"
          min="0"
          step="0.01"
          value={max}
          onChange={(e) => setMax(e.target.value)}
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={handleApply} className="flex-1" disabled={isPending}>
          Apply
        </Button>
        {(min || max) && (
          <Button onClick={handleClear} variant="outline" className="flex-1" disabled={isPending}>
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
