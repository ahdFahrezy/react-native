import React from 'react';
import { StyleSheet, Pressable, View, StyleProp, ViewStyle } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useThemeMode, ThemeMode } from '@/context/theme-context';
import { useTheme } from '@/hooks/use-theme';

export interface ThemeToggleProps {
  variant?: 'icon' | 'pill';
  style?: StyleProp<ViewStyle>;
}

export function ThemeToggle({ variant = 'icon', style }: ThemeToggleProps) {
  const { mode, isDark, toggleTheme, setMode } = useThemeMode();
  const theme = useTheme();

  if (variant === 'pill') {
    const options: { mode: ThemeMode; label: string; icon: string }[] = [
      { mode: 'light', label: 'Light', icon: '☀️' },
      { mode: 'dark', label: 'Dark', icon: '🌙' },
      { mode: 'system', label: 'Auto', icon: '⚙️' },
    ];

    return (
      <View
        style={[
          styles.pillContainer,
          { backgroundColor: theme.backgroundElement, borderColor: theme.border },
          style,
        ]}
      >
        {options.map((opt) => {
          const active = mode === opt.mode;
          return (
            <Pressable
              key={opt.mode}
              onPress={() => setMode(opt.mode)}
              style={({ pressed }) => [
                styles.pillSegment,
                active && [
                  styles.pillSegmentActive,
                  { backgroundColor: isDark ? '#0D9488' : '#0F172A' },
                ],
                pressed && styles.pressed,
              ]}
            >
              <ThemedText style={styles.pillIcon}>{opt.icon}</ThemedText>
              <ThemedText
                style={[
                  styles.pillLabel,
                  active && styles.pillLabelActive,
                ]}
              >
                {opt.label}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
    );
  }

  // Compact Icon Button
  return (
    <Pressable
      onPress={toggleTheme}
      accessibilityLabel={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      style={({ pressed }) => [
        styles.iconButton,
        {
          backgroundColor: theme.backgroundElement,
          borderColor: theme.border,
        },
        pressed && styles.pressed,
        style,
      ]}
    >
      <ThemedText style={styles.iconEmoji}>{isDark ? '☀️' : '🌙'}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  iconEmoji: {
    fontSize: 17,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.96 }],
  },
  pillContainer: {
    flexDirection: 'row',
    borderRadius: 20,
    padding: 3,
    borderWidth: 1,
    gap: 2,
    alignSelf: 'flex-start',
  },
  pillSegment: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  pillSegmentActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  pillIcon: {
    fontSize: 13,
  },
  pillLabel: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.8,
  },
  pillLabelActive: {
    color: '#FFFFFF',
    opacity: 1,
  },
});
