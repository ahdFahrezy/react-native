import React from 'react';
import { StyleSheet, View, ActivityIndicator, ViewStyle, StyleProp } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { AppButton } from '@/components/ui/app-button';
import { Spacing } from '@/constants/theme';

export interface StateViewProps {
  type: 'loading' | 'error' | 'empty';
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryText?: string;
  actionText?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function StateView({
  type,
  title,
  message,
  onRetry,
  retryText = 'Try Again',
  actionText,
  onAction,
  style,
}: StateViewProps) {
  if (type === 'loading') {
    return (
      <View style={[styles.centerContainer, style]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <ThemedText style={styles.loadingText}>
          {message || 'Loading data...'}
        </ThemedText>
      </View>
    );
  }

  if (type === 'error') {
    return (
      <View style={[styles.centerContainer, style]}>
        <ThemedText style={styles.icon}>⚠️</ThemedText>
        <ThemedText type="subtitle" style={styles.title}>
          {title || 'Something went wrong'}
        </ThemedText>
        <ThemedText style={styles.message}>
          {message || 'Failed to load information. Please check your connection.'}
        </ThemedText>
        {onRetry && (
          <AppButton
            title={retryText}
            onPress={onRetry}
            variant="primary"
            size="sm"
            style={styles.actionBtn}
          />
        )}
      </View>
    );
  }

  // Empty state
  return (
    <View style={[styles.centerContainer, style]}>
      <ThemedText style={styles.icon}>📭</ThemedText>
      <ThemedText type="subtitle" style={styles.title}>
        {title || 'No Data Available'}
      </ThemedText>
      <ThemedText style={styles.message}>
        {message || 'The data you are looking for could not be found.'}
      </ThemedText>
      {onAction && actionText && (
        <AppButton
          title={actionText}
          onPress={onAction}
          variant="outline"
          size="sm"
          style={styles.actionBtn}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    padding: Spacing.four,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    alignSelf: 'stretch',
  },
  loadingText: {
    marginTop: Spacing.one,
    fontSize: 14,
    opacity: 0.6,
  },
  icon: {
    fontSize: 40,
    marginBottom: Spacing.one,
  },
  title: {
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    fontSize: 14,
    opacity: 0.6,
    maxWidth: 280,
  },
  actionBtn: {
    marginTop: Spacing.two,
    minWidth: 120,
  },
});
