import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, Pressable, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useThemeColor } from '@/hooks/useThemeColor';
import { getOrder } from '@/lib/api';
import { Order } from '@trove/shared';

const statusColors: Record<string, string> = {
  pending: '#eab308',
  confirmed: '#3b82f6',
  processing: '#8b5cf6',
  shipped: '#6366f1',
  delivered: '#22c55e',
  cancelled: '#ef4444',
};

export default function OrderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const backgroundColor = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({}, 'border');
  const cardBackground = useThemeColor({}, 'card');

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const orderData = await getOrder(id);
        setOrder(orderData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load order');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error || !order) {
    return (
      <View style={[styles.errorContainer, { backgroundColor }]}>
        <Ionicons name="alert-circle-outline" size={80} color="#ef4444" />
        <ThemedText type="subtitle" style={styles.errorTitle}>
          Order Not Found
        </ThemedText>
        <ThemedText type="secondary" style={styles.errorSubtitle}>
          {error || 'The order could not be found.'}
        </ThemedText>
        <Pressable
          style={[styles.button, { backgroundColor: tintColor }]}
          onPress={() => router.replace('/')}
        >
          <ThemedText style={styles.buttonText}>Go Home</ThemedText>
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Success Banner */}
        <View
          style={[styles.successBanner, { backgroundColor: '#dcfce7', borderColor: '#22c55e' }]}
        >
          <Ionicons name="checkmark-circle" size={32} color="#22c55e" />
          <View style={styles.successText}>
            <ThemedText type="subtitle" style={{ color: '#166534' }}>
              Order Confirmed!
            </ThemedText>
            <ThemedText style={{ color: '#166534', fontSize: 14 }}>
              Confirmation sent to {order.shippingAddress.email}
            </ThemedText>
          </View>
        </View>

        {/* Order Info */}
        <View style={[styles.section, { backgroundColor: cardBackground, borderColor }]}>
          <View style={styles.orderHeader}>
            <View>
              <ThemedText type="subtitle">{order.orderNumber}</ThemedText>
              <ThemedText type="secondary" style={{ fontSize: 12 }}>
                {formatDate(order.createdAt)}
              </ThemedText>
            </View>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: statusColors[order.status] || '#6b7280' },
              ]}
            >
              <ThemedText style={styles.statusText}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </ThemedText>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: borderColor }]} />

          {/* Order Items */}
          {order.items.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              {item.product?.imageUrl && (
                <Image source={{ uri: item.product.imageUrl }} style={styles.itemImage} />
              )}
              <View style={styles.itemDetails}>
                <ThemedText numberOfLines={1}>{item.productName}</ThemedText>
                <ThemedText type="secondary">
                  {formatPrice(item.productPrice)} x {item.quantity}
                </ThemedText>
              </View>
              <ThemedText type="defaultSemiBold">{formatPrice(item.subtotal)}</ThemedText>
            </View>
          ))}

          <View style={[styles.divider, { backgroundColor: borderColor }]} />

          {/* Totals */}
          <View style={styles.summaryRow}>
            <ThemedText type="secondary">Subtotal</ThemedText>
            <ThemedText>{formatPrice(order.subtotal)}</ThemedText>
          </View>
          <View style={styles.summaryRow}>
            <ThemedText type="secondary">Shipping</ThemedText>
            <ThemedText style={order.shippingCost === 0 ? { color: '#22c55e' } : undefined}>
              {order.shippingCost === 0 ? 'Free' : formatPrice(order.shippingCost)}
            </ThemedText>
          </View>
          <View style={styles.summaryRow}>
            <ThemedText type="subtitle">Total</ThemedText>
            <ThemedText type="subtitle" style={{ color: tintColor }}>
              {formatPrice(order.total)}
            </ThemedText>
          </View>
        </View>

        {/* Shipping Address */}
        <View style={[styles.section, { backgroundColor: cardBackground, borderColor }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location-outline" size={20} color={tintColor} />
            <ThemedText type="subtitle" style={{ marginLeft: 8 }}>
              Shipping Address
            </ThemedText>
          </View>
          <ThemedText style={styles.addressLine}>{order.shippingAddress.name}</ThemedText>
          <ThemedText type="secondary" style={styles.addressLine}>
            {order.shippingAddress.address}
          </ThemedText>
          <ThemedText type="secondary" style={styles.addressLine}>
            {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
            {order.shippingAddress.zipCode}
          </ThemedText>
          <View style={[styles.divider, { backgroundColor: borderColor, marginVertical: 12 }]} />
          <View style={styles.contactRow}>
            <Ionicons name="mail-outline" size={16} color={tintColor} />
            <ThemedText type="secondary" style={{ marginLeft: 8 }}>
              {order.shippingAddress.email}
            </ThemedText>
          </View>
          <View style={styles.contactRow}>
            <Ionicons name="call-outline" size={16} color={tintColor} />
            <ThemedText type="secondary" style={{ marginLeft: 8 }}>
              {order.shippingAddress.phone}
            </ThemedText>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Pressable
            style={[styles.button, { backgroundColor: tintColor }]}
            onPress={() => router.replace('/')}
          >
            <Ionicons name="home-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
            <ThemedText style={styles.buttonText}>Continue Shopping</ThemedText>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  successText: {
    marginLeft: 12,
    flex: 1,
  },
  section: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  addressLine: {
    marginBottom: 4,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  actions: {
    marginTop: 8,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  errorSubtitle: {
    marginBottom: 24,
    textAlign: 'center',
  },
});
