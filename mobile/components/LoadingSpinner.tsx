import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { ThemedView } from './ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  fullScreen?: boolean;
}

export function LoadingSpinner({ size = 'large', fullScreen = false }: LoadingSpinnerProps) {
  const tintColor = useThemeColor({}, 'tint');

  return (
    <ThemedView style={[styles.container, fullScreen && styles.fullScreen]}>
      <ActivityIndicator size={size} color={tintColor} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreen: {
    flex: 1,
  },
});
