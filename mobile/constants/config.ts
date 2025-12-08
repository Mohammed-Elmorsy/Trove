import Constants from 'expo-constants';

// Get the local machine's IP for development
// In production, this would be your actual API URL
const getApiUrl = (): string => {
  // For development, use your machine's IP address
  // Set API_URL in your .env file (see .env.example)
  const devApiUrl = Constants.expoConfig?.extra?.apiUrl;

  console.log('API URL:', devApiUrl);
  if (devApiUrl) {
    return devApiUrl;
  }

  // Default to localhost for web/emulator
  // For physical devices, set API_URL in .env file
  return 'http://localhost:4000';
};

export const API_BASE_URL = getApiUrl();
export const DEFAULT_TIMEOUT = 10000; // 10 seconds
