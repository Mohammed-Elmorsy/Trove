import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Pressable,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useAuth } from '@/context/AuthContext';
import { getOrdersByEmail, getUserOrders } from '@/lib/api';
import { Order } from '@trove/shared';

const statusColors: Record<string, { bg: string; text: string }> = {
  pending: { bg: '#fef3c7', text: '#92400e' },
  confirmed: { bg: '#dbeafe', text: '#1e40af' },
  processing: { bg: '#e9d5ff', text: '#6b21a8' },
  shipped: { bg: '#c7d2fe', text: '#3730a3' },
  delivered: { bg: '#bbf7d0', text: '#166534' },
  cancelled: { bg: '#fecaca', text: '#991b1b' },
};

type LoadingState = 'idle' | 'loading' | 'refreshing' | 'searching';

export default function OrdersScreen() {
  const router = useRouter();
  const { isAuthenticated, accessToken, isLoading: authLoading } = useAuth();

  // State
  const [email, setEmail] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [hasLoadedUserOrders, setHasLoadedUserOrders] = useState(false);

  // Theme colors
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({}, 'border');
  const cardBackground = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor({}, 'tabIconDefault');

  // Fetch authenticated user's orders
  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      // Reset state when logged out
      setOrders([]);
      setHasLoadedUserOrders(false);
      setHasSearched(false);
      return;
    }

    // Only fetch once per auth session
    if (hasLoadedUserOrders) return;

    const fetchOrders = async () => {
      setLoadingState('loading');
      setError(null);

      try {
        const results = await getUserOrders(accessToken);
        setOrders(results);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch orders');
        setOrders([]);
      } finally {
        setLoadingState('idle');
        setHasLoadedUserOrders(true);
      }
    };

    fetchOrders();
  }, [isAuthenticated, accessToken, hasLoadedUserOrders]);

  const handleSearch = async () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoadingState('searching');
    setError(null);

    try {
      const results = await getOrdersByEmail(email);
      setOrders(results);
      setHasSearched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search orders');
      setOrders([]);
    } finally {
      setLoadingState('idle');
    }
  };

  const handleRefresh = async () => {
    setLoadingState('refreshing');
    setError(null);

    try {
      if (isAuthenticated && accessToken) {
        const results = await getUserOrders(accessToken);
        setOrders(results);
      } else if (hasSearched && email) {
        const results = await getOrdersByEmail(email);
        setOrders(results);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh');
    } finally {
      setLoadingState('idle');
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

  const renderOrderCard = (order: Order) => {
    const status = statusColors[order.status] || { bg: '#f3f4f6', text: '#374151' };

    return (
      <Pressable
        key={order.id}
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

  const renderEmptyState = (message: string) => (
    <View style={[styles.emptyState, { backgroundColor: cardBackground, borderColor }]}>
      <Ionicons name="receipt-outline" size={48} color={placeholderColor} />
      <ThemedText type="secondary" style={styles.emptyText}>
        {message}
      </ThemedText>
      <Pressable
        style={[styles.shopButton, { backgroundColor: tintColor }]}
        onPress={() => router.push('/(tabs)' as never)}
      >
        <ThemedText style={styles.shopButtonText}>Start Shopping</ThemedText>
      </Pressable>
    </View>
  );

  // Loading state (auth loading or initial fetch)
  if (authLoading || (isAuthenticated && loadingState === 'loading' && !hasLoadedUserOrders)) {
    return (
      <ThemedView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={tintColor} />
      </ThemedView>
    );
  }

  // Authenticated user view
  if (isAuthenticated) {
    return (
      <ThemedView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={loadingState === 'refreshing'}
              onRefresh={handleRefresh}
              tintColor={tintColor}
              colors={[tintColor]}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerSection}>
            <ThemedText type="subtitle">Your Orders</ThemedText>
            <ThemedText type="secondary" style={styles.headerSubtitle}>
              View and track your order history
            </ThemedText>
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <ThemedText style={styles.errorText}>{error}</ThemedText>
            </View>
          )}

          {orders.length > 0 ? (
            <View style={styles.ordersList}>{orders.map(renderOrderCard)}</View>
          ) : (
            renderEmptyState("You haven't placed any orders yet.")
          )}
        </ScrollView>
      </ThemedView>
    );
  }

  // Guest view - search by email
  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          hasSearched ? (
            <RefreshControl
              refreshing={loadingState === 'refreshing'}
              onRefresh={handleRefresh}
              tintColor={tintColor}
              colors={[tintColor]}
            />
          ) : undefined
        }
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
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
              disabled={loadingState === 'searching'}
            >
              {loadingState === 'searching' ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="search" size={20} color="#fff" />
              )}
            </Pressable>
          </View>

          {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}
        </View>

        {/* Results or Initial State */}
        {hasSearched ? (
          <>
            <ThemedText type="defaultSemiBold" style={styles.resultsTitle}>
              {orders.length === 0
                ? 'No orders found'
                : `Found ${orders.length} order${orders.length === 1 ? '' : 's'}`}
            </ThemedText>

            {orders.length > 0 ? (
              <View style={styles.ordersList}>{orders.map(renderOrderCard)}</View>
            ) : (
              renderEmptyState('No orders found for this email address.')
            )}
          </>
        ) : (
          <View style={styles.initialState}>
            <Ionicons name="receipt-outline" size={64} color={placeholderColor} />
            <ThemedText type="secondary" style={styles.initialText}>
              Search for your orders using your email address
            </ThemedText>
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  headerSection: {
    padding: 16,
    paddingBottom: 8,
  },
  headerSubtitle: {
    marginTop: 4,
  },
  errorContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  searchSection: {
    margin: 16,
    marginBottom: 16,
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
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 8,
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
  resultsTitle: {
    marginBottom: 12,
    marginHorizontal: 16,
  },
  ordersList: {
    paddingHorizontal: 16,
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
    margin: 16,
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
    alignItems: 'center',
    padding: 32,
    paddingTop: 48,
  },
  initialText: {
    marginTop: 16,
    textAlign: 'center',
  },
});
