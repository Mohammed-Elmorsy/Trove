import React, { useState, useEffect } from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';

interface SearchBarProps {
  initialSearch: string;
  onSearch: (search: string) => void;
}

export function SearchBar({ initialSearch, onSearch }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearch);

  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({}, 'border');
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'textSecondary');

  // Update local state when initialSearch changes (e.g., when clearing filters)
  useEffect(() => {
    setSearchTerm(initialSearch);
  }, [initialSearch]);

  const handleSubmit = () => {
    onSearch(searchTerm.trim());
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <View style={[styles.container, { borderColor, backgroundColor }]}>
      <Ionicons name="search" size={20} color={secondaryTextColor} style={styles.searchIcon} />
      <TextInput
        style={[styles.input, { color: textColor }]}
        value={searchTerm}
        onChangeText={setSearchTerm}
        placeholder="Search products..."
        placeholderTextColor={secondaryTextColor}
        onSubmitEditing={handleSubmit}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {searchTerm ? (
        <Pressable onPress={handleClear} hitSlop={8} style={styles.clearButton}>
          <Ionicons name="close-circle" size={20} color={secondaryTextColor} />
        </Pressable>
      ) : null}
      <Pressable
        onPress={handleSubmit}
        style={[styles.submitButton, { backgroundColor: tintColor }]}
      >
        <Ionicons name="arrow-forward" size={18} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    paddingLeft: 12,
    paddingRight: 4,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  clearButton: {
    padding: 4,
    marginRight: 4,
  },
  submitButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
