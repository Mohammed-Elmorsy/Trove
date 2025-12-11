import React from 'react';
import { FlatList, StyleSheet, View, Pressable, Image, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useCart } from '@/context/CartContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import { CartItem } from '@trove/shared';

function CartItemCard({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCart();
  const borderColor = useThemeColor({}, 'border');
  const cardBackground = useThemeColor({}, 'card');
  const tintColor = useThemeColor({}, 'tint');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const handleIncrement = async () => {
    try {
      await updateQuantity(item.id, item.quantity + 1);
    } catch (_error) {
      Alert.alert('Error', 'Failed to update quantity');
    }
  };

  const handleDecrement = async () => {
    if (item.quantity <= 1) {
      handleRemove();
      return;
    }
    try {
      await updateQuantity(item.id, item.quantity - 1);
    } catch (_error) {
      Alert.alert('Error', 'Failed to update quantity');
    }
  };

  const handleRemove = () => {
    Alert.alert('Remove Item', `Remove ${item.product.name} from cart?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          try {
            await removeItem(item.id);
          } catch (_error) {
            Alert.alert('Error', 'Failed to remove item');
          }
        },
      },
    ]);
  };

  return (
    <View style={[styles.cartItem, { backgroundColor: cardBackground, borderColor }]}>
      <Link href={`/product/${item.productId}`} asChild>
        <Pressable style={styles.itemContent}>
          {item.product.imageUrl ? (
            <Image
              source={{ uri: item.product.imageUrl }}
              style={styles.itemImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.placeholderImage, { backgroundColor: borderColor }]}>
              <ThemedText type="secondary">No Image</ThemedText>
            </View>
          )}
          <View style={styles.itemDetails}>
            <ThemedText type="secondary" style={[styles.categoryText, { color: tintColor }]}>
              {item.product.category.name}
            </ThemedText>
            <ThemedText type="defaultSemiBold" numberOfLines={2}>
              {item.product.name}
            </ThemedText>
            <ThemedText type="defaultSemiBold" style={{ color: tintColor }}>
              {formatPrice(item.product.price)}
            </ThemedText>
          </View>
        </Pressable>
      </Link>
      <View style={styles.quantityContainer}>
        <Pressable style={[styles.quantityButton, { borderColor }]} onPress={handleDecrement}>
          <Ionicons name="remove" size={18} color={tintColor} />
        </Pressable>
        <ThemedText style={styles.quantityText}>{item.quantity}</ThemedText>
        <Pressable style={[styles.quantityButton, { borderColor }]} onPress={handleIncrement}>
          <Ionicons name="add" size={18} color={tintColor} />
        </Pressable>
        <Pressable style={styles.removeButton} onPress={handleRemove}>
          <Ionicons name="trash-outline" size={20} color="#ef4444" />
        </Pressable>
      </View>
    </View>
  );
}

function EmptyCart() {
  const tintColor = useThemeColor({}, 'tint');

  return (
    <ThemedView style={styles.emptyContainer}>
      <Ionicons name="cart-outline" size={80} color={tintColor} />
      <ThemedText type="subtitle" style={styles.emptyTitle}>
        Your cart is empty
      </ThemedText>
      <ThemedText type="secondary" style={styles.emptySubtitle}>
        Start shopping to add items to your cart
      </ThemedText>
      <Link href="/" asChild>
        <Pressable style={[styles.shopButton, { backgroundColor: tintColor }]}>
          <ThemedText style={styles.shopButtonText}>Browse Products</ThemedText>
        </Pressable>
      </Link>
    </ThemedView>
  );
}

function CartSummary() {
  const router = useRouter();
  const { cart } = useCart();
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({}, 'border');
  const cardBackground = useThemeColor({}, 'card');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  if (!cart || cart.items.length === 0) return null;

  const handleCheckout = () => {
    router.push('/checkout' as never);
  };

  return (
    <View
      style={[
        styles.summaryContainer,
        { backgroundColor: cardBackground, borderTopColor: borderColor },
      ]}
    >
      <View style={styles.summaryRow}>
        <ThemedText type="secondary">
          Subtotal ({cart.itemCount} {cart.itemCount === 1 ? 'item' : 'items'})
        </ThemedText>
        <ThemedText type="subtitle" style={{ color: tintColor }}>
          {formatPrice(cart.subtotal)}
        </ThemedText>
      </View>
      <Pressable
        style={[styles.checkoutButton, { backgroundColor: tintColor }]}
        onPress={handleCheckout}
      >
        <ThemedText style={styles.checkoutButtonText}>Proceed to Checkout</ThemedText>
      </Pressable>
    </View>
  );
}

export default function CartScreen() {
  const { cart, isLoading } = useCart();

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!cart || cart.items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={cart.items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CartItemCard item={item} />}
        contentContainerStyle={styles.listContent}
      />
      <CartSummary />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 200,
  },
  cartItem: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
  },
  itemContent: {
    flexDirection: 'row',
    padding: 12,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  placeholderImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  categoryText: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 12,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    minWidth: 30,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  removeButton: {
    marginLeft: 'auto',
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    marginBottom: 24,
    textAlign: 'center',
  },
  shopButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  shopButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  summaryContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkoutButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
