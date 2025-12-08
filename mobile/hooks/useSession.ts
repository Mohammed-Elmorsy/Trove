import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_KEY = 'trove_session_id';

// Generate a UUID-like string for session ID
function generateSessionId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function useSession() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOrCreateSession();
  }, []);

  const loadOrCreateSession = async () => {
    try {
      let storedSessionId = await AsyncStorage.getItem(SESSION_KEY);

      if (!storedSessionId) {
        storedSessionId = generateSessionId();
        await AsyncStorage.setItem(SESSION_KEY, storedSessionId);
      }

      setSessionId(storedSessionId);
    } catch (error) {
      console.error('Error loading session:', error);
      // Fallback to a new session if storage fails
      const newSessionId = generateSessionId();
      setSessionId(newSessionId);
    } finally {
      setIsLoading(false);
    }
  };

  const clearSession = async () => {
    try {
      const newSessionId = generateSessionId();
      await AsyncStorage.setItem(SESSION_KEY, newSessionId);
      setSessionId(newSessionId);
    } catch (error) {
      console.error('Error clearing session:', error);
    }
  };

  return {
    sessionId,
    isLoading,
    clearSession,
  };
}
