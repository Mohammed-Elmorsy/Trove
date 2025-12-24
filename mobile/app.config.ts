import 'dotenv/config';
import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Trove',
  slug: 'trove-mobile',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'trove',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  // EAS Build requires owner for managed builds
  owner: process.env.EXPO_OWNER || 'your-expo-username',
  splash: {
    image: './assets/images/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.trove.mobile',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    edgeToEdgeEnabled: true,
    package: 'com.trove.mobile',
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: ['expo-router', 'expo-secure-store'],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    apiUrl: process.env.API_URL || 'http://localhost:4000',
    eas: {
      projectId: process.env.EAS_PROJECT_ID || 'your-eas-project-id',
    },
  },
});
