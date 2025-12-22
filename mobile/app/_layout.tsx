import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { Colors } from '@/constants/Colors';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const backgroundColor = Colors[colorScheme ?? 'light'].background;

  return (
    <SafeAreaProvider style={{ backgroundColor }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AuthProvider>
          <CartProvider>
            <Stack
              screenOptions={{
                headerStyle: { backgroundColor },
              }}
            >
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="product/[id]"
                options={{
                  title: 'Product Details',
                  headerBackTitle: 'Back',
                }}
              />
              <Stack.Screen
                name="checkout"
                options={{
                  title: 'Checkout',
                  headerBackTitle: 'Cart',
                }}
              />
              <Stack.Screen
                name="order/[id]"
                options={{
                  title: 'Order Confirmation',
                  headerBackVisible: false,
                }}
              />
              <Stack.Screen
                name="auth/login"
                options={{
                  title: 'Sign In',
                  headerBackTitle: 'Back',
                  presentation: 'modal',
                }}
              />
              <Stack.Screen
                name="auth/register"
                options={{
                  title: 'Create Account',
                  headerBackTitle: 'Back',
                  presentation: 'modal',
                }}
              />
            </Stack>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
