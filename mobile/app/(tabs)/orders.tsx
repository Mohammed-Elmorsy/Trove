import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Pressable, FlatList, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useThemeColor } from '@/hooks/useThemeColor';
import { getOrdersByEmail } from '@/lib/api';
import { Order } from '@trove/shared';

const statusColors: Record<string, { bg: string; text: string }> = {
  pending: { bg: '#fef3c7', text: '#92400e' },
  confirmed: { bg: '#dbeafe', text: '#1e40af' },
  processing: { bg: '#e9d5ff', text: '#6b21a8' },
  shipped: { bg: '#c7d2fe', text: '#3730a3' },
  delivered: { bg: '#bbf7d0', text: '#166534' },
  cancelled: { bg: '#fecaca', text: '#991b1b' },
};

export default function OrdersScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchedEmail, setSearchedEmail] = useState<string | null>(null);

  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({}, 'border');
  const cardBackground = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor({}, 'tabIconDefault');

  const handleSearch = async () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const results = await getOrdersByEmail(email);
      setOrders(results);
      setSearchedEmail(email);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search orders';
      setError(errorMessage);
      setOrders(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (searchedEmail) {
      setIsLoading(true);
      try {
        const results = await getOrdersByEmail(searchedEmail);
        setOrders(results);
      } catch (_err) {
        // Silent refresh failure
      } finally {
        setIsLoading(false);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const renderOrder = ({ item: order }: { item: Order }) => {
    const status = statusColors[order.status] || { bg: '#f3f4f6', text: '#374151' };

    return (
      <Pressable
        style={[styles.orderCard, { backgroundColor: cardBackground, borderColor }]}
        onPress={() => router.push(`/order/${order.id}` as never)}
      >
        <View style={styles.orderHeader}>
          <View>
            <ThemedText type="defaultSemiBold">{order.orderNumber}</ThemedText>
            <ThemedText type="secondary" style={styles.orderDate}>
              {formatDate(order.createdAt)}
            </ThemedText>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
            <ThemedText style={[styles.statusText, { color: status.text }]}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </ThemedText>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: borderColor }]} />

        <View style={styles.orderFooter}>
          <View>
            <ThemedText type="secondary">
              {order.items.length} item{order.items.length === 1 ? '' : 's'}
            </ThemedText>
            <ThemedText type="defaultSemiBold">{formatPrice(order.total)}</ThemedText>
          </View>
          <Ionicons name="chevron-forward" size={20} color={placeholderColor} />
        </View>
      </Pressable>
    );
  };

  return (
    <ThemedView style={styles.container}>
      {/* Search Section */}
      <View style={[styles.searchSection, { backgroundColor: cardBackground, borderColor }]}>
        <ThemedText type="subtitle" style={styles.searchTitle}>
          Find Your Orders
        </ThemedText>
        <ThemedText type="secondary" style={styles.searchSubtitle}>
          Enter the email address you used when placing your order.
        </ThemedText>

        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, { borderColor, color: textColor }]}
            placeholder="john@example.com"
            placeholderTextColor={placeholderColor}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (error) setError(null);
            }}
            onSubmitEditing={handleSearch}
          />
          <Pressable
            style={[styles.searchButton, { backgroundColor: tintColor }]}
            onPress={handleSearch}
            disabled={isLoading}
          >
            {isLoading ? (
              <LoadingSpinner size="small" />
            ) : (
              <Ionicons name="search" size={20} color="#fff" />
            )}
          </Pressable>
        </View>

        {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}
      </View>

      {/* Results */}
      {orders !== null && (
        <View style={styles.resultsSection}>
          <ThemedText type="defaultSemiBold" style={styles.resultsTitle}>
            {orders.length === 0
              ? 'No orders found'
              : `Found ${orders.length} order${orders.length === 1 ? '' : 's'}`}
          </ThemedText>

          {orders.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: cardBackground, borderColor }]}>
              <Ionicons name="receipt-outline" size={48} color={placeholderColor} />
              <ThemedText type="secondary" style={styles.emptyText}>
                No orders found for this email address.
              </ThemedText>
              <Pressable
                style={[styles.shopButton, { backgroundColor: tintColor }]}
                onPress={() => router.push('/(tabs)' as never)}
              >
                <ThemedText style={styles.shopButtonText}>Start Shopping</ThemedText>
              </Pressable>
            </View>
          ) : (
            <FlatList
              data={orders}
              renderItem={renderOrder}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.ordersList}
              refreshControl={<RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      )}

      {/* Initial State */}
      {orders === null && !isLoading && (
        <View style={styles.initialState}>
          <Ionicons name="receipt-outline" size={64} color={placeholderColor} />
          <ThemedText type="secondary" style={styles.initialText}>
            Search for your orders using your email address
          </ThemedText>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchSection: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchTitle: {
    marginBottom: 4,
  },
  searchSubtitle: {
    marginBottom: 16,
    fontSize: 14,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  searchButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginTop: 8,
  },
  resultsSection: {
    flex: 1,
    paddingHorizontal: 16,
  },
  resultsTitle: {
    marginBottom: 12,
  },
  ordersList: {
    paddingBottom: 16,
  },
  orderCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderDate: {
    fontSize: 13,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emptyState: {
    padding: 32,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 12,
    marginBottom: 20,
    textAlign: 'center',
  },
  shopButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  initialState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  initialText: {
    marginTop: 16,
    textAlign: 'center',
  },
});
