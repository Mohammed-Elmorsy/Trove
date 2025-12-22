import React, { useState } from 'react';
import { View, TextInput, Pressable, StyleSheet, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

interface PriceFilterProps {
  minPrice: string;
  maxPrice: string;
  onApply: (minPrice: string, maxPrice: string) => void;
}

export function PriceFilter({ minPrice, maxPrice, onApply }: PriceFilterProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [min, setMin] = useState(minPrice);
  const [max, setMax] = useState(maxPrice);

  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({}, 'border');
  const backgroundColor = useThemeColor({}, 'background');
  const cardBackground = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'textSecondary');

  const hasActiveFilter = minPrice || maxPrice;

  const handleOpen = () => {
    setMin(minPrice);
    setMax(maxPrice);
    setIsVisible(true);
  };

  const handleApply = () => {
    // Validate that min <= max if both are provided
    if (min && max) {
      const minValue = parseFloat(min);
      const maxValue = parseFloat(max);
      if (minValue > maxValue) {
        Alert.alert('Invalid Range', 'Minimum price cannot be greater than maximum price');
        return;
      }
    }
    onApply(min, max);
    setIsVisible(false);
  };

  const handleClear = () => {
    setMin('');
    setMax('');
    onApply('', '');
    setIsVisible(false);
  };

  const formatFilterLabel = () => {
    if (minPrice && maxPrice) {
      return `$${minPrice} - $${maxPrice}`;
    } else if (minPrice) {
      return `From $${minPrice}`;
    } else if (maxPrice) {
      return `Up to $${maxPrice}`;
    }
    return 'Price';
  };

  return (
    <>
      <Pressable
        style={[
          styles.filterButton,
          {
            backgroundColor: hasActiveFilter ? tintColor : backgroundColor,
            borderColor: hasActiveFilter ? tintColor : borderColor,
          },
        ]}
        onPress={handleOpen}
      >
        <Ionicons name="pricetag-outline" size={16} color={hasActiveFilter ? '#fff' : textColor} />
        <ThemedText
          style={[styles.filterButtonText, { color: hasActiveFilter ? '#fff' : textColor }]}
          numberOfLines={1}
        >
          {formatFilterLabel()}
        </ThemedText>
        <Ionicons
          name="chevron-down"
          size={14}
          color={hasActiveFilter ? '#fff' : secondaryTextColor}
        />
      </Pressable>

      <Modal
        visible={isVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setIsVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setIsVisible(false)}>
          <Pressable
            style={[styles.modalContent, { backgroundColor: cardBackground }]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <ThemedText type="subtitle">Filter by Price</ThemedText>
              <Pressable onPress={() => setIsVisible(false)} hitSlop={8}>
                <Ionicons name="close" size={24} color={textColor} />
              </Pressable>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <ThemedText type="secondary" style={styles.inputLabel}>
                  Min Price
                </ThemedText>
                <View style={[styles.inputRow, { borderColor }]}>
                  <ThemedText style={styles.currencySymbol}>$</ThemedText>
                  <TextInput
                    style={[styles.input, { color: textColor }]}
                    value={min}
                    onChangeText={setMin}
                    placeholder="0"
                    placeholderTextColor={secondaryTextColor}
                    keyboardType="decimal-pad"
                  />
                </View>
              </View>

              <View style={styles.inputSeparator}>
                <ThemedText type="secondary">to</ThemedText>
              </View>

              <View style={styles.inputWrapper}>
                <ThemedText type="secondary" style={styles.inputLabel}>
                  Max Price
                </ThemedText>
                <View style={[styles.inputRow, { borderColor }]}>
                  <ThemedText style={styles.currencySymbol}>$</ThemedText>
                  <TextInput
                    style={[styles.input, { color: textColor }]}
                    value={max}
                    onChangeText={setMax}
                    placeholder="1000"
                    placeholderTextColor={secondaryTextColor}
                    keyboardType="decimal-pad"
                  />
                </View>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              {(min || max) && (
                <Pressable style={[styles.clearButton, { borderColor }]} onPress={handleClear}>
                  <ThemedText style={{ color: textColor }}>Clear</ThemedText>
                </Pressable>
              )}
              <Pressable
                style={[
                  styles.applyButton,
                  { backgroundColor: tintColor },
                  min || max ? styles.applyButtonWithClear : null,
                ]}
                onPress={handleApply}
              >
                <ThemedText style={styles.applyButtonText}>Apply</ThemedText>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 18,
    borderWidth: 1,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    maxWidth: 100,
    marginHorizontal: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  inputWrapper: {
    flex: 1,
    marginHorizontal: 4,
  },
  inputLabel: {
    fontSize: 12,
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  currencySymbol: {
    fontSize: 16,
    marginRight: 4,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  inputSeparator: {
    paddingBottom: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  clearButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  applyButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  applyButtonWithClear: {
    flex: 1,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
