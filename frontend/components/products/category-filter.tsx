'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Category } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategoryId?: string;
  search?: string;
  minPrice?: string;
  maxPrice?: string;
}

export function CategoryFilter({
  categories,
  selectedCategoryId,
  search,
  minPrice,
  maxPrice,
}: CategoryFilterProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const buildUrl = (categoryId?: string) => {
    const params = new URLSearchParams();

    if (search) {
      params.set('search', search);
    }
    if (categoryId) {
      params.set('categoryId', categoryId);
    }
    if (minPrice) {
      params.set('minPrice', minPrice);
    }
    if (maxPrice) {
      params.set('maxPrice', maxPrice);
    }

    return `/products?${params.toString()}`;
  };

  const handleCategoryClick = (categoryId: string | null) => {
    startTransition(() => {
      router.push(buildUrl(categoryId || undefined));
    });
  };

  return (
    <div className="space-y-1" role="group" aria-label="Filter by category">
      <Button
        variant={!selectedCategoryId ? 'secondary' : 'ghost'}
        onClick={() => handleCategoryClick(null)}
        disabled={isPending}
        className={cn('w-full justify-start', !selectedCategoryId && 'bg-primary/10 text-primary')}
        aria-label="Show all categories"
        aria-pressed={!selectedCategoryId}
      >
        {!selectedCategoryId && <Check className="mr-2 h-4 w-4" />}
        All Categories
      </Button>

      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategoryId === category.id ? 'secondary' : 'ghost'}
          onClick={() => handleCategoryClick(category.id)}
          disabled={isPending}
          className={cn(
            'w-full justify-start',
            selectedCategoryId === category.id && 'bg-primary/10 text-primary'
          )}
          aria-label={`Filter by ${category.name}`}
          aria-pressed={selectedCategoryId === category.id}
        >
          {selectedCategoryId === category.id && <Check className="mr-2 h-4 w-4" />}
          {category.name}
        </Button>
      ))}
    </div>
  );
}
