import React from 'react';
import { StyleSheet, View, Text, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';

export interface AppDividerProps {
  label?: string;
  orientation?: 'horizontal' | 'vertical';
  spacing?: number;
  style?: StyleProp<ViewStyle>;
}

export function AppDivider({
  label,
  orientation = 'horizontal',
  spacing = Spacing.two,
  style,
}: AppDividerProps) {
  const theme = useTheme();

  if (orientation === 'vertical') {
    return (
      <View
        style={[
          styles.verticalLine,
          {
            backgroundColor: theme.backgroundSelected,
            marginHorizontal: spacing,
          },
          style,
        ]}
      />
    );
  }

  if (label) {
    return (
      <View
        style={[
          styles.labelContainer,
          { marginVertical: spacing },
          style,
        ]}
      >
        <View style={[styles.line, { backgroundColor: theme.backgroundSelected }]} />
        <Text style={[styles.labelText, { color: theme.textSecondary }]}>
          {label}
        </Text>
        <View style={[styles.line, { backgroundColor: theme.backgroundSelected }]} />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.line,
        {
          backgroundColor: theme.backgroundSelected,
          marginVertical: spacing,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  line: {
    height: 1,
    flex: 1,
  },
  verticalLine: {
    width: 1,
    alignSelf: 'stretch',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    width: '100%',
  },
  labelText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
