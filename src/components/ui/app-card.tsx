import React from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

export interface AppCardProps {
  title?: string;
  subtitle?: string;
  headerRight?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

export function AppCard({
  title,
  subtitle,
  headerRight,
  footer,
  children,
  style,
  onPress,
}: AppCardProps) {
  const content = (
    <ThemedView type="backgroundElement" style={[styles.card, style]}>
      {(title || subtitle || headerRight) && (
        <View style={styles.header}>
          <View style={styles.headerTitles}>
            {title && <ThemedText type="subtitle">{title}</ThemedText>}
            {subtitle && <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>}
          </View>
          {headerRight && <View style={styles.headerRight}>{headerRight}</View>}
        </View>
      )}

      {children && <View style={styles.body}>{children}</View>}

      {footer && <View style={styles.footer}>{footer}</View>}
    </ThemedView>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: Spacing.three,
    gap: Spacing.two,
    alignSelf: 'stretch',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.one,
  },
  headerTitles: {
    gap: 2,
    flex: 1,
  },
  subtitle: {
    fontSize: 13,
    opacity: 0.6,
  },
  headerRight: {
    marginLeft: Spacing.two,
  },
  body: {
    gap: Spacing.one,
  },
  footer: {
    marginTop: Spacing.one,
    paddingTop: Spacing.two,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(150, 150, 150, 0.2)',
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
});
