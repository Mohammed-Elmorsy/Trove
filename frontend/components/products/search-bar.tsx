'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  initialSearch?: string;
  categoryId?: string;
  minPrice?: string;
  maxPrice?: string;
}

export function SearchBar({ initialSearch = '', categoryId, minPrice, maxPrice }: SearchBarProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState(initialSearch);

  const buildUrl = (search?: string) => {
    const params = new URLSearchParams();

    if (search && search.trim()) {
      params.set('search', search.trim());
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(() => {
      router.push(buildUrl(searchTerm));
    });
  };

  const handleClear = () => {
    setSearchTerm('');
    startTransition(() => {
      router.push(buildUrl());
    });
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2">
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pr-8"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <Button type="submit" size="icon" disabled={isPending}>
        <Search className="h-4 w-4" />
      </Button>
    </form>
  );
}
