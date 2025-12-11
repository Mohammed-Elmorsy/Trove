import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, StyleSheet, View, Image, Pressable, Alert, Dimensions } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Product } from '@trove/shared';
import { getProduct } from '@/lib/api';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { useCart } from '@/context/CartContext';
import { useThemeColor } from '@/hooks/useThemeColor';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const { addToCart } = useCart();
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({}, 'border');
  const cardBackground = useThemeColor({}, 'card');
  const successColor = useThemeColor({}, 'success');

  const loadProduct = useCallback(async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await getProduct(id);
      setProduct(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load product');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      setIsAddingToCart(true);
      await addToCart(product.id, quantity);
      Alert.alert('Added to Cart', `${quantity} x ${product.name} added to your cart`, [
        { text: 'OK' },
      ]);
      setQuantity(1);
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity((q) => q + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error || !product) {
    return <ErrorMessage message={error || 'Product not found'} onRetry={loadProduct} />;
  }

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: product.name,
          headerBackTitle: 'Back',
        }}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          {product.imageUrl ? (
            <Image source={{ uri: product.imageUrl }} style={styles.image} resizeMode="cover" />
          ) : (
            <View style={[styles.placeholderImage, { backgroundColor: borderColor }]}>
              <Ionicons name="image-outline" size={64} color={borderColor} />
              <ThemedText type="secondary">No Image</ThemedText>
            </View>
          )}
        </View>

        <View style={[styles.content, { backgroundColor: cardBackground }]}>
          <ThemedText type="secondary" style={[styles.category, { color: tintColor }]}>
            {product.category.name}
          </ThemedText>

          <ThemedText type="title" style={styles.name}>
            {product.name}
          </ThemedText>

          <ThemedText type="title" style={[styles.price, { color: tintColor }]}>
            {formatPrice(product.price)}
          </ThemedText>

          {isLowStock && (
            <View style={[styles.stockBadge, { backgroundColor: '#fef3c7' }]}>
              <Ionicons name="warning-outline" size={16} color="#f59e0b" />
              <ThemedText style={styles.stockWarningText}>
                Only {product.stock} left in stock
              </ThemedText>
            </View>
          )}

          {isOutOfStock && (
            <View style={[styles.stockBadge, { backgroundColor: '#fee2e2' }]}>
              <Ionicons name="close-circle-outline" size={16} color="#ef4444" />
              <ThemedText style={styles.outOfStockText}>Out of Stock</ThemedText>
            </View>
          )}

          {product.description && (
            <View style={styles.descriptionContainer}>
              <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                Description
              </ThemedText>
              <ThemedText type="secondary" style={styles.description}>
                {product.description}
              </ThemedText>
            </View>
          )}
        </View>
      </ScrollView>

      {!isOutOfStock && (
        <View
          style={[
            styles.footer,
            {
              backgroundColor: cardBackground,
              borderTopColor: borderColor,
              paddingBottom: Math.max(insets.bottom, 16),
            },
          ]}
        >
          <View style={styles.quantitySelector}>
            <Pressable
              style={[styles.quantityButton, { borderColor }]}
              onPress={decrementQuantity}
              disabled={quantity <= 1}
            >
              <Ionicons name="remove" size={20} color={quantity <= 1 ? borderColor : tintColor} />
            </Pressable>
            <ThemedText style={styles.quantityText}>{quantity}</ThemedText>
            <Pressable
              style={[styles.quantityButton, { borderColor }]}
              onPress={incrementQuantity}
              disabled={quantity >= product.stock}
            >
              <Ionicons
                name="add"
                size={20}
                color={quantity >= product.stock ? borderColor : tintColor}
              />
            </Pressable>
          </View>
          <Pressable
            style={[
              styles.addToCartButton,
              { backgroundColor: isAddingToCart ? successColor : tintColor },
            ]}
            onPress={handleAddToCart}
            disabled={isAddingToCart}
          >
            <Ionicons name="cart-outline" size={20} color="#fff" />
            <ThemedText style={styles.addToCartText}>
              {isAddingToCart ? 'Adding...' : 'Add to Cart'}
            </ThemedText>
          </Pressable>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  imageContainer: {
    width: width,
    height: width,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
    marginTop: -20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  category: {
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  name: {
    fontSize: 24,
    marginBottom: 8,
  },
  price: {
    fontSize: 28,
    marginBottom: 16,
  },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
    gap: 6,
  },
  stockWarningText: {
    color: '#92400e',
    fontSize: 14,
    fontWeight: '500',
  },
  outOfStockText: {
    color: '#b91c1c',
    fontSize: 14,
    fontWeight: '500',
  },
  descriptionContainer: {
    marginTop: 8,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  description: {
    lineHeight: 24,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    gap: 16,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '600',
    minWidth: 30,
    textAlign: 'center',
  },
  addToCartButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
