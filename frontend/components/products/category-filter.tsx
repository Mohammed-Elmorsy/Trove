'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Category } from '@/types/product';
import { Badge } from '@/components/ui/badge';

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
    <div className="space-y-2" role="group" aria-label="Filter by category">
      <button
        onClick={() => handleCategoryClick(null)}
        disabled={isPending}
        className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
          !selectedCategoryId ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-gray-100'
        } disabled:opacity-50`}
        aria-label="Show all categories"
        aria-pressed={!selectedCategoryId}
      >
        All Categories
      </button>

      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => handleCategoryClick(category.id)}
          disabled={isPending}
          className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
            selectedCategoryId === category.id
              ? 'bg-blue-50 text-blue-700 font-medium'
              : 'hover:bg-gray-100'
          } disabled:opacity-50`}
          aria-label={`Filter by ${category.name}`}
          aria-pressed={selectedCategoryId === category.id}
        >
          <div className="flex items-center justify-between">
            <span>{category.name}</span>
            {selectedCategoryId === category.id && <Badge variant="default">Selected</Badge>}
          </div>
        </button>
      ))}
    </div>
  );
}
