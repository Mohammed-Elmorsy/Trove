import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FlatList, StyleSheet, RefreshControl, View } from 'react-native';
import { Product, Category } from '@trove/shared';
import { getProducts, getCategories } from '@/lib/api';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ProductCard } from '@/components/ProductCard';
import { CategoryFilter } from '@/components/CategoryFilter';
import { SearchBar } from '@/components/SearchBar';
import { PriceFilter } from '@/components/PriceFilter';
import { LoadMoreButton } from '@/components/LoadMoreButton';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { useThemeColor } from '@/hooks/useThemeColor';

const ITEMS_PER_PAGE = 12;

export default function ProductsScreen() {
  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Filter state
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Loading state
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track if filters changed to reset products
  const filtersRef = useRef({ selectedCategoryId, search, minPrice, maxPrice });
  const isFirstLoad = useRef(true);

  const tintColor = useThemeColor({}, 'tint');

  const loadCategories = useCallback(async () => {
    try {
      setIsCategoriesLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setIsCategoriesLoading(false);
    }
  }, []);

  const loadProducts = useCallback(
    async (page: number, append: boolean = false) => {
      try {
        setError(null);
        const query: Record<string, any> = {
          page,
          limit: ITEMS_PER_PAGE,
        };

        if (selectedCategoryId) query.categoryId = selectedCategoryId;
        if (search) query.search = search;
        if (minPrice) query.minPrice = parseFloat(minPrice);
        if (maxPrice) query.maxPrice = parseFloat(maxPrice);

        const response = await getProducts(query);

        if (append) {
          setProducts((prev) => [...prev, ...response.data]);
        } else {
          setProducts(response.data);
        }

        setTotalProducts(response.meta.total);
        setHasMore(page < response.meta.totalPages);
        setCurrentPage(page);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setIsInitialLoading(false);
        setIsLoadingMore(false);
        setIsRefreshing(false);
      }
    },
    [selectedCategoryId, search, minPrice, maxPrice]
  );

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Load products when filters change
  useEffect(() => {
    const filtersChanged =
      filtersRef.current.selectedCategoryId !== selectedCategoryId ||
      filtersRef.current.search !== search ||
      filtersRef.current.minPrice !== minPrice ||
      filtersRef.current.maxPrice !== maxPrice;

    if (filtersChanged) {
      filtersRef.current = { selectedCategoryId, search, minPrice, maxPrice };
      // Only show full-screen loading on first load
      if (isFirstLoad.current) {
        setIsInitialLoading(true);
      }
      loadProducts(1, false);
    }
  }, [selectedCategoryId, search, minPrice, maxPrice, loadProducts]);

  // Initial load
  useEffect(() => {
    loadProducts(1, false).then(() => {
      isFirstLoad.current = false;
    });
  }, []);

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
  };

  const handleSearch = (searchTerm: string) => {
    setSearch(searchTerm);
  };

  const handlePriceFilter = (min: string, max: string) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      setIsLoadingMore(true);
      loadProducts(currentPage + 1, true);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadProducts(1, false);
    loadCategories();
  };

  const handleRetry = () => {
    setIsInitialLoading(true);
    loadProducts(1, false);
  };

  // Get selected category name for title
  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

  // Build page title
  const getPageTitle = () => {
    if (selectedCategory) {
      return selectedCategory.name;
    }
    return 'All Products';
  };

  // Only show full-screen loading on initial app load
  if (isInitialLoading && !isRefreshing) {
    return <LoadingSpinner fullScreen />;
  }

  if (error && products.length === 0) {
    return <ErrorMessage message={error} onRetry={handleRetry} />;
  }

  const ListHeaderComponent = () => (
    <View style={styles.headerContainer}>
      {/* Page Title */}
      <View style={styles.titleContainer}>
        <ThemedText type="title" style={styles.title}>
          {getPageTitle()}
        </ThemedText>
        <ThemedText type="secondary" style={styles.productCount}>
          {totalProducts} {totalProducts === 1 ? 'product' : 'products'}
        </ThemedText>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SearchBar initialSearch={search} onSearch={handleSearch} />
      </View>

      {/* Filters Row */}
      <View style={styles.filtersContainer}>
        <CategoryFilter
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={handleCategoryChange}
          isLoading={isCategoriesLoading}
        />
        <View style={styles.priceFilterContainer}>
          <PriceFilter minPrice={minPrice} maxPrice={maxPrice} onApply={handlePriceFilter} />
        </View>
      </View>
    </View>
  );

  const ListFooterComponent = () => (
    <LoadMoreButton
      onPress={handleLoadMore}
      isLoading={isLoadingMore}
      hasMore={hasMore}
      currentCount={products.length}
      totalCount={totalProducts}
    />
  );

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <ErrorMessage message="No products found" />
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={products.length > 0 ? styles.row : undefined}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <ProductCard product={item} />
          </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={tintColor}
          />
        }
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
        ListEmptyComponent={ListEmptyComponent}
        onEndReachedThreshold={0.5}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingBottom: 8,
  },
  titleContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  title: {
    fontSize: 28,
    marginBottom: 4,
  },
  productCount: {
    fontSize: 14,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  filtersContainer: {
    paddingBottom: 8,
  },
  priceFilterContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    alignItems: 'flex-start',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  cardWrapper: {
    flex: 1,
    maxWidth: '48%',
  },
  emptyContainer: {
    flex: 1,
    paddingTop: 50,
  },
});
