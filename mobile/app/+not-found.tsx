import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function NotFoundScreen() {
  const tintColor = useThemeColor({}, 'tint');

  return (
    <>
      <Stack.Screen options={{ title: 'Not Found' }} />
      <ThemedView style={styles.container}>
        <Ionicons name="alert-circle-outline" size={64} color={tintColor} />
        <ThemedText type="title" style={styles.title}>
          Page Not Found
        </ThemedText>
        <ThemedText type="secondary" style={styles.subtitle}>
          The page you're looking for doesn't exist.
        </ThemedText>

        <Link href="/" style={[styles.link, { backgroundColor: tintColor }]}>
          <ThemedText style={styles.linkText}>Go to Home</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 24,
    textAlign: 'center',
  },
  link: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  linkText: {
    color: '#fff',
    fontWeight: '600',
  },
});
