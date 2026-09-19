import React from 'react';
import { StyleSheet, View, Pressable, ActivityIndicator } from 'react-native';
import { useHealth } from '@/hooks/use-health';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

export function HealthCard() {
  const { result, loading, error, refetch } = useHealth();

  const getStatusBadge = () => {
    if (loading && !result) {
      return { color: '#0d74ce', label: 'Checking...' };
    }
    if (error || result?.status === 'down') {
      return { color: '#e5484d', label: 'Down' };
    }
    if (result?.status === 'degraded') {
      return { color: '#f5a623', label: 'Degraded' };
    }
    return { color: '#30a46c', label: 'Healthy' };
  };

  const badge = getStatusBadge();

  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <ThemedText type="subtitle">System Health</ThemedText>
          <ThemedText style={styles.subtitle}>Repository-Service Pattern</ThemedText>
        </View>

        <View style={[styles.badge, { backgroundColor: `${badge.color}20`, borderColor: badge.color }]}>
          <View style={[styles.dot, { backgroundColor: badge.color }]} />
          <ThemedText style={[styles.badgeText, { color: badge.color }]}>
            {badge.label}
          </ThemedText>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.metricRow}>
          <ThemedText style={styles.metricLabel}>Endpoint:</ThemedText>
          <ThemedText type="code" style={styles.metricValue}>
            {result?.endpoint || 'Resolving...'}
          </ThemedText>
        </View>

        <View style={styles.metricRow}>
          <ThemedText style={styles.metricLabel}>Response Time:</ThemedText>
          <ThemedText style={styles.metricValue}>
            {result ? `${result.latencyMs} ms` : '-'}
          </ThemedText>
        </View>

        <View style={styles.metricRow}>
          <ThemedText style={styles.metricLabel}>Last Checked:</ThemedText>
          <ThemedText style={styles.metricValue}>
            {result?.timestamp || '-'}
          </ThemedText>
        </View>

        {error && (
          <ThemedText style={styles.errorText}>
            ⚠️ {error}
          </ThemedText>
        )}
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
          loading && styles.buttonDisabled,
        ]}
        onPress={refetch}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <ThemedText style={styles.buttonText}>Ping Health API</ThemedText>
        )}
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: Spacing.three,
    marginTop: Spacing.one,
    gap: Spacing.two,
    alignSelf: 'stretch',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    gap: 2,
  },
  subtitle: {
    fontSize: 12,
    opacity: 0.6,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    gap: 6,
    marginVertical: Spacing.one,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 13,
    opacity: 0.7,
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '500',
  },
  errorText: {
    color: '#e5484d',
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.one,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
});
