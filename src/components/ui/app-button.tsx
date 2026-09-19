import React from 'react';
import {
  StyleSheet,
  Pressable,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function AppButton({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
}: AppButtonProps) {
  const theme = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          button: { backgroundColor: '#007AFF', borderWidth: 0 },
          text: { color: '#ffffff' },
          spinnerColor: '#ffffff',
        };
      case 'secondary':
        return {
          button: { backgroundColor: theme.backgroundElement, borderWidth: 0 },
          text: { color: theme.text },
          spinnerColor: theme.text,
        };
      case 'outline':
        return {
          button: {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: theme.backgroundSelected,
          },
          text: { color: theme.text },
          spinnerColor: theme.text,
        };
      case 'ghost':
        return {
          button: { backgroundColor: 'transparent', borderWidth: 0 },
          text: { color: theme.text },
          spinnerColor: theme.text,
        };
      case 'danger':
        return {
          button: { backgroundColor: '#e5484d', borderWidth: 0 },
          text: { color: '#ffffff' },
          spinnerColor: '#ffffff',
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          button: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8 },
          text: { fontSize: 13 },
        };
      case 'lg':
        return {
          button: { paddingVertical: 14, paddingHorizontal: 20, borderRadius: 14 },
          text: { fontSize: 16, fontWeight: '600' as const },
        };
      case 'md':
      default:
        return {
          button: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10 },
          text: { fontSize: 14, fontWeight: '600' as const },
        };
    }
  };

  const vStyles = getVariantStyles();
  const sStyles = getSizeStyles();
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.baseButton,
        vStyles.button,
        sStyles.button,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={vStyles.spinnerColor} />
      ) : (
        <>
          {leftIcon}
          <ThemedText style={[vStyles.text, sStyles.text, textStyle]}>
            {title}
          </ThemedText>
          {rightIcon}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  baseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.99 }],
  },
  disabled: {
    opacity: 0.5,
  },
});
