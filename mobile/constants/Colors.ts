/**
 * Below are the colors used in the app. The colors are defined in the light and dark mode.
 * Trove brand colors
 */

const tintColorLight = '#2563eb'; // Blue-600
const tintColorDark = '#60a5fa'; // Blue-400

export const Colors = {
  light: {
    text: '#11181C',
    textSecondary: '#687076',
    background: '#fff',
    backgroundSecondary: '#f4f4f5',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    border: '#e4e4e7',
    card: '#ffffff',
    success: '#22c55e',
    error: '#ef4444',
    warning: '#f59e0b',
  },
  dark: {
    text: '#ECEDEE',
    textSecondary: '#9BA1A6',
    background: '#151718',
    backgroundSecondary: '#1f2123',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    border: '#27272a',
    card: '#1f2123',
    success: '#22c55e',
    error: '#ef4444',
    warning: '#f59e0b',
  },
};

export default Colors;
