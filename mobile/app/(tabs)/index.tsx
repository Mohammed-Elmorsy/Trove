import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, StyleSheet, RefreshControl, View } from 'react-native';
import { Product, Category } from '@trove/shared';
import { getProducts, getCategories } from '@/lib/api';
import { ThemedView } from '@/components/ThemedView';
import { ProductCard } from '@/components/ProductCard';
import { CategoryFilter } from '@/components/CategoryFilter';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function ProductsScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const loadProducts = useCallback(async (categoryId: string | null = null) => {
    try {
      setError(null);
      const query = categoryId ? { categoryId } : {};
      const response = await getProducts(query);
      setProducts(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, [loadCategories, loadProducts]);

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
    setIsLoading(true);
    loadProducts(categoryId);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadProducts(selectedCategoryId);
    loadCategories();
  };

  const handleRetry = () => {
    setIsLoading(true);
    loadProducts(selectedCategoryId);
  };

  if (isLoading && !isRefreshing) {
    return <LoadingSpinner fullScreen />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={handleRetry} />;
  }

  return (
    <ThemedView style={styles.container}>
      <CategoryFilter
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={handleCategoryChange}
        isLoading={isCategoriesLoading}
      />
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
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
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ErrorMessage message="No products found" />
          </View>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  row: {
    gap: 12,
  },
  cardWrapper: {
    flex: 1,
    maxWidth: '50%',
  },
  emptyContainer: {
    flex: 1,
    paddingTop: 50,
  },
});
