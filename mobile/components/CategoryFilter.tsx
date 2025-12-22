import React, { useRef, useCallback, useEffect } from 'react';
import {
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Text,
  LayoutChangeEvent,
} from 'react-native';
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
  const scrollViewRef = useRef<ScrollView>(null);
  const chipPositions = useRef<{ [key: string]: { x: number; width: number } }>({});
  const scrollViewWidth = useRef<number>(0);
  const layoutReady = useRef(false);

  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({}, 'border');
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  const scrollToSelectedChip = useCallback(() => {
    const chipId = selectedCategoryId ?? 'all';
    const position = chipPositions.current[chipId];
    if (position && scrollViewRef.current && scrollViewWidth.current > 0) {
      // Center the chip in the scroll view
      const scrollX = position.x - scrollViewWidth.current / 2 + position.width / 2;
      scrollViewRef.current.scrollTo({
        x: Math.max(0, scrollX),
        animated: true,
      });
    }
  }, [selectedCategoryId]);

  // Scroll to selected chip whenever selectedCategoryId changes
  useEffect(() => {
    if (layoutReady.current) {
      // Small delay to ensure layout is complete after re-render
      const timer = setTimeout(scrollToSelectedChip, 50);
      return () => clearTimeout(timer);
    }
  }, [selectedCategoryId, scrollToSelectedChip]);

  const handleScrollViewLayout = useCallback(
    (event: LayoutChangeEvent) => {
      scrollViewWidth.current = event.nativeEvent.layout.width;
      // Mark layout as ready and scroll to selected on initial render
      if (!layoutReady.current) {
        layoutReady.current = true;
        setTimeout(scrollToSelectedChip, 50);
      }
    },
    [scrollToSelectedChip]
  );

  const handleChipLayout = useCallback((id: string, event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout;
    chipPositions.current[id] = { x, width };
  }, []);

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={tintColor} />
      </ThemedView>
    );
  }

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      onLayout={handleScrollViewLayout}
    >
      <Pressable
        onLayout={(e) => handleChipLayout('all', e)}
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
          onLayout={(e) => handleChipLayout(category.id, e)}
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
    marginRight: 8,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
