import React from 'react';
import { StyleSheet, View, Text, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';

export type BadgeVariant =
  | 'primary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'neutral'
  | 'outline';

export type BadgeSize = 'sm' | 'md';

export interface AppBadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function AppBadge({
  label,
  variant = 'neutral',
  size = 'md',
  dot = false,
  icon,
  style,
  textStyle,
}: AppBadgeProps) {
  const theme = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          container: { backgroundColor: 'rgba(0, 122, 255, 0.12)', borderColor: 'transparent' },
          text: { color: '#007AFF' },
          dotColor: '#007AFF',
        };
      case 'success':
        return {
          container: { backgroundColor: 'rgba(52, 199, 89, 0.12)', borderColor: 'transparent' },
          text: { color: '#34C759' },
          dotColor: '#34C759',
        };
      case 'warning':
        return {
          container: { backgroundColor: 'rgba(255, 149, 0, 0.12)', borderColor: 'transparent' },
          text: { color: '#FF9500' },
          dotColor: '#FF9500',
        };
      case 'error':
        return {
          container: { backgroundColor: 'rgba(255, 59, 48, 0.12)', borderColor: 'transparent' },
          text: { color: '#FF3B30' },
          dotColor: '#FF3B30',
        };
      case 'info':
        return {
          container: { backgroundColor: 'rgba(88, 86, 214, 0.12)', borderColor: 'transparent' },
          text: { color: '#5856D6' },
          dotColor: '#5856D6',
        };
      case 'outline':
        return {
          container: {
            backgroundColor: 'transparent',
            borderColor: theme.backgroundSelected,
            borderWidth: 1,
          },
          text: { color: theme.text },
          dotColor: theme.text,
        };
      case 'neutral':
      default:
        return {
          container: { backgroundColor: theme.backgroundElement, borderColor: 'transparent' },
          text: { color: theme.textSecondary },
          dotColor: theme.textSecondary,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          container: { paddingVertical: 2, paddingHorizontal: 6, borderRadius: 6 },
          text: { fontSize: 11, fontWeight: '500' as const },
          dotSize: 5,
        };
      case 'md':
      default:
        return {
          container: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 8 },
          text: { fontSize: 12, fontWeight: '600' as const },
          dotSize: 6,
        };
    }
  };

  const vStyles = getVariantStyles();
  const sStyles = getSizeStyles();

  return (
    <View
      style={[
        styles.badge,
        vStyles.container,
        sStyles.container,
        style,
      ]}
    >
      {dot && (
        <View
          style={[
            styles.dot,
            {
              width: sStyles.dotSize,
              height: sStyles.dotSize,
              borderRadius: sStyles.dotSize / 2,
              backgroundColor: vStyles.dotColor,
            },
          ]}
        />
      )}
      {icon}
      <Text style={[sStyles.text, vStyles.text, textStyle]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
    alignSelf: 'flex-start',
  },
  dot: {
    marginRight: 2,
  },
});
