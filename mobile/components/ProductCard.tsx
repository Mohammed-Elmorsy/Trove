import React from 'react';
import { View, Image, StyleSheet, Pressable, Platform } from 'react-native';
import { Link } from 'expo-router';
import { Product } from '@trove/shared';
import { ThemedText } from './ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const cardBackground = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'border');
  const tintColor = useThemeColor({}, 'tint');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <Link href={`/product/${product.id}`} asChild>
      <Pressable
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: cardBackground,
            borderColor,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          },
        ]}
      >
        <View style={styles.imageContainer}>
          {product.imageUrl ? (
            <Image source={{ uri: product.imageUrl }} style={styles.image} resizeMode="cover" />
          ) : (
            <View style={[styles.placeholderImage, { backgroundColor: borderColor }]}>
              <ThemedText type="secondary">No Image</ThemedText>
            </View>
          )}
          {/* Stock badge overlay */}
          {product.stock <= 5 && product.stock > 0 && (
            <View style={[styles.stockBadge, styles.lowStockBadge]}>
              <ThemedText style={styles.stockBadgeText}>Only {product.stock} left</ThemedText>
            </View>
          )}
          {product.stock === 0 && (
            <View style={[styles.stockBadge, styles.outOfStockBadge]}>
              <ThemedText style={styles.stockBadgeText}>Out of stock</ThemedText>
            </View>
          )}
        </View>
        <View style={styles.content}>
          <View style={[styles.categoryBadge, { backgroundColor: `${tintColor}15` }]}>
            <ThemedText style={[styles.category, { color: tintColor }]} numberOfLines={1}>
              {product.category.name}
            </ThemedText>
          </View>
          <ThemedText type="defaultSemiBold" style={styles.name} numberOfLines={2}>
            {product.name}
          </ThemedText>
          <ThemedText type="defaultSemiBold" style={[styles.price, { color: tintColor }]}>
            {formatPrice(product.price)}
          </ThemedText>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 12,
    maxWidth: '100%',
    // Modern shadow
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      },
    }),
  },
  imageContainer: {
    aspectRatio: 1,
    overflow: 'hidden',
    backgroundColor: '#f8f9fa',
    marginHorizontal: 8,
    marginTop: 8,
    borderRadius: 12,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  stockBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  lowStockBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.9)',
  },
  outOfStockBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
  },
  stockBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  content: {
    padding: 12,
    paddingTop: 10,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  category: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  name: {
    fontSize: 14,
    marginBottom: 8,
    minHeight: 40,
    lineHeight: 20,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
  },
});
