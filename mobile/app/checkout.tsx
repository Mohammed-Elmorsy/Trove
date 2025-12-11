import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useCart } from '@/context/CartContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import { createOrder } from '@/lib/api';
import { ShippingAddress } from '@trove/shared';

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export default function CheckoutScreen() {
  const router = useRouter();
  const { cart, sessionId, refreshCart, isLoading: cartLoading } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({}, 'border');
  const cardBackground = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor({}, 'tabIconDefault');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name || formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.phone || formData.phone.length < 10) {
      newErrors.phone = 'Phone must be at least 10 digits';
    }
    if (!formData.address || formData.address.length < 5) {
      newErrors.address = 'Address must be at least 5 characters';
    }
    if (!formData.city || formData.city.length < 2) {
      newErrors.city = 'City must be at least 2 characters';
    }
    if (!formData.state || formData.state.length < 2) {
      newErrors.state = 'State must be at least 2 characters';
    }
    if (!formData.zipCode || formData.zipCode.length < 3) {
      newErrors.zipCode = 'ZIP code must be at least 3 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    if (!sessionId) {
      Alert.alert('Error', 'Session not found. Please restart the app.');
      return;
    }

    setIsSubmitting(true);

    try {
      const shippingAddress: ShippingAddress = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
      };

      const response = await createOrder(sessionId, shippingAddress);
      await refreshCart();
      router.replace(`/order/${response.order.id}` as never);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to place order';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  if (cartLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <ThemedView style={styles.emptyContainer}>
        <Ionicons name="cart-outline" size={80} color={tintColor} />
        <ThemedText type="subtitle" style={styles.emptyTitle}>
          Your cart is empty
        </ThemedText>
        <ThemedText type="secondary" style={styles.emptySubtitle}>
          Add items to your cart before checking out
        </ThemedText>
        <Pressable
          style={[styles.button, { backgroundColor: tintColor }]}
          onPress={() => router.back()}
        >
          <ThemedText style={styles.buttonText}>Browse Products</ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  const shipping = cart.subtotal >= 50 ? 0 : 5.99;
  const total = cart.subtotal + shipping;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ThemedView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Order Summary */}
          <View style={[styles.section, { backgroundColor: cardBackground, borderColor }]}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Order Summary
            </ThemedText>
            {cart.items.map((item) => (
              <View key={item.id} style={styles.orderItem}>
                {item.product.imageUrl && (
                  <Image source={{ uri: item.product.imageUrl }} style={styles.itemImage} />
                )}
                <View style={styles.itemDetails}>
                  <ThemedText numberOfLines={1}>{item.product.name}</ThemedText>
                  <ThemedText type="secondary">
                    {formatPrice(item.product.price)} x {item.quantity}
                  </ThemedText>
                </View>
                <ThemedText type="defaultSemiBold">
                  {formatPrice(item.product.price * item.quantity)}
                </ThemedText>
              </View>
            ))}
            <View style={[styles.divider, { backgroundColor: borderColor }]} />
            <View style={styles.summaryRow}>
              <ThemedText type="secondary">Subtotal</ThemedText>
              <ThemedText>{formatPrice(cart.subtotal)}</ThemedText>
            </View>
            <View style={styles.summaryRow}>
              <ThemedText type="secondary">Shipping</ThemedText>
              <ThemedText style={shipping === 0 ? { color: '#22c55e' } : undefined}>
                {shipping === 0 ? 'Free' : formatPrice(shipping)}
              </ThemedText>
            </View>
            <View style={styles.summaryRow}>
              <ThemedText type="subtitle">Total</ThemedText>
              <ThemedText type="subtitle" style={{ color: tintColor }}>
                {formatPrice(total)}
              </ThemedText>
            </View>
          </View>

          {/* Shipping Form */}
          <View style={[styles.section, { backgroundColor: cardBackground, borderColor }]}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Shipping Information
            </ThemedText>

            <View style={styles.inputGroup}>
              <ThemedText type="secondary" style={styles.label}>
                Full Name
              </ThemedText>
              <TextInput
                style={[
                  styles.input,
                  { borderColor: errors.name ? '#ef4444' : borderColor, color: textColor },
                ]}
                placeholder="John Doe"
                placeholderTextColor={placeholderColor}
                value={formData.name}
                onChangeText={(v) => updateField('name', v)}
              />
              {errors.name && <ThemedText style={styles.errorText}>{errors.name}</ThemedText>}
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <ThemedText type="secondary" style={styles.label}>
                  Email
                </ThemedText>
                <TextInput
                  style={[
                    styles.input,
                    { borderColor: errors.email ? '#ef4444' : borderColor, color: textColor },
                  ]}
                  placeholder="john@example.com"
                  placeholderTextColor={placeholderColor}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.email}
                  onChangeText={(v) => updateField('email', v)}
                />
                {errors.email && <ThemedText style={styles.errorText}>{errors.email}</ThemedText>}
              </View>
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 12 }]}>
                <ThemedText type="secondary" style={styles.label}>
                  Phone
                </ThemedText>
                <TextInput
                  style={[
                    styles.input,
                    { borderColor: errors.phone ? '#ef4444' : borderColor, color: textColor },
                  ]}
                  placeholder="(555) 123-4567"
                  placeholderTextColor={placeholderColor}
                  keyboardType="phone-pad"
                  value={formData.phone}
                  onChangeText={(v) => updateField('phone', v)}
                />
                {errors.phone && <ThemedText style={styles.errorText}>{errors.phone}</ThemedText>}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <ThemedText type="secondary" style={styles.label}>
                Street Address
              </ThemedText>
              <TextInput
                style={[
                  styles.input,
                  { borderColor: errors.address ? '#ef4444' : borderColor, color: textColor },
                ]}
                placeholder="123 Main St"
                placeholderTextColor={placeholderColor}
                value={formData.address}
                onChangeText={(v) => updateField('address', v)}
              />
              {errors.address && <ThemedText style={styles.errorText}>{errors.address}</ThemedText>}
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 2 }]}>
                <ThemedText type="secondary" style={styles.label}>
                  City
                </ThemedText>
                <TextInput
                  style={[
                    styles.input,
                    { borderColor: errors.city ? '#ef4444' : borderColor, color: textColor },
                  ]}
                  placeholder="New York"
                  placeholderTextColor={placeholderColor}
                  value={formData.city}
                  onChangeText={(v) => updateField('city', v)}
                />
                {errors.city && <ThemedText style={styles.errorText}>{errors.city}</ThemedText>}
              </View>
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 12 }]}>
                <ThemedText type="secondary" style={styles.label}>
                  State
                </ThemedText>
                <TextInput
                  style={[
                    styles.input,
                    { borderColor: errors.state ? '#ef4444' : borderColor, color: textColor },
                  ]}
                  placeholder="NY"
                  placeholderTextColor={placeholderColor}
                  value={formData.state}
                  onChangeText={(v) => updateField('state', v)}
                />
                {errors.state && <ThemedText style={styles.errorText}>{errors.state}</ThemedText>}
              </View>
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 12 }]}>
                <ThemedText type="secondary" style={styles.label}>
                  ZIP Code
                </ThemedText>
                <TextInput
                  style={[
                    styles.input,
                    { borderColor: errors.zipCode ? '#ef4444' : borderColor, color: textColor },
                  ]}
                  placeholder="10001"
                  placeholderTextColor={placeholderColor}
                  keyboardType="numeric"
                  value={formData.zipCode}
                  onChangeText={(v) => updateField('zipCode', v)}
                />
                {errors.zipCode && (
                  <ThemedText style={styles.errorText}>{errors.zipCode}</ThemedText>
                )}
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Place Order Button */}
        <View
          style={[styles.footer, { backgroundColor: cardBackground, borderTopColor: borderColor }]}
        >
          <Pressable
            style={[
              styles.submitButton,
              { backgroundColor: tintColor },
              isSubmitting && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <LoadingSpinner size="small" />
            ) : (
              <>
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color="#fff"
                  style={{ marginRight: 8 }}
                />
                <ThemedText style={styles.submitButtonText}>Place Order</ThemedText>
              </>
            )}
          </Pressable>
        </View>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
  },
  section: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 16,
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
  divider: {
    height: 1,
    marginVertical: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
  },
  submitButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
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
  button: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
