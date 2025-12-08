import React from 'react';
import { ScrollView, Pressable, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { Category } from '@trove/shared';
import { ThemedView } from './ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  isLoading?: boolean;
}

export function CategoryFilter({
  categories,
  selectedCategoryId,
  onSelectCategory,
  isLoading = false,
}: CategoryFilterProps) {
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({}, 'border');
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={tintColor} />
      </ThemedView>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <Pressable
        style={[
          styles.chip,
          {
            backgroundColor: selectedCategoryId === null ? tintColor : backgroundColor,
            borderColor: selectedCategoryId === null ? tintColor : borderColor,
          },
        ]}
        onPress={() => onSelectCategory(null)}
      >
        <Text
          style={[styles.chipText, { color: selectedCategoryId === null ? '#fff' : textColor }]}
        >
          All
        </Text>
      </Pressable>
      {categories.map((category) => (
        <Pressable
          key={category.id}
          style={[
            styles.chip,
            {
              backgroundColor: selectedCategoryId === category.id ? tintColor : backgroundColor,
              borderColor: selectedCategoryId === category.id ? tintColor : borderColor,
            },
          ]}
          onPress={() => onSelectCategory(category.id)}
        >
          <Text
            style={[
              styles.chipText,
              {
                color: selectedCategoryId === category.id ? '#fff' : textColor,
              },
            ]}
          >
            {category.name}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  loadingContainer: {
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chip: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
