import React from 'react';
import { Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { ThemedText } from './ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

interface LoadMoreButtonProps {
  onPress: () => void;
  isLoading: boolean;
  hasMore: boolean;
  currentCount: number;
  totalCount: number;
}

export function LoadMoreButton({
  onPress,
  isLoading,
  hasMore,
  currentCount,
  totalCount,
}: LoadMoreButtonProps) {
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({}, 'border');
  const secondaryTextColor = useThemeColor({}, 'textSecondary');

  if (!hasMore) {
    if (currentCount > 0) {
      return (
        <ThemedText type="secondary" style={styles.endText}>
          Showing all {totalCount} products
        </ThemedText>
      );
    }
    return null;
  }

  return (
    <Pressable
      style={[styles.button, { borderColor: tintColor }]}
      onPress={onPress}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={tintColor} />
      ) : (
        <>
          <ThemedText style={[styles.buttonText, { color: tintColor }]}>Load More</ThemedText>
          <ThemedText type="secondary" style={styles.countText}>
            Showing {currentCount} of {totalCount}
          </ThemedText>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    marginVertical: 16,
    marginHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 60,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  countText: {
    fontSize: 12,
    marginTop: 4,
  },
  endText: {
    textAlign: 'center',
    paddingVertical: 16,
    fontSize: 14,
  },
});
