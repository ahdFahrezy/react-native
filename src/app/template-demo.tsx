import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ScreenLayout } from '@/components/templates/screen-layout';
import { AppCard } from '@/components/ui/app-card';
import { AppButton } from '@/components/ui/app-button';
import { AppInput } from '@/components/ui/app-input';
import { StateView } from '@/components/ui/state-view';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

export default function TemplateDemoScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [stateTab, setStateTab] = useState<'none' | 'loading' | 'error' | 'empty'>('none');

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    alert(`Form submitted for: ${email}`);
  };

  return (
    <ScreenLayout
      title="Template Preview"
      subtitle="Component Catalog & Base Layout"
      showBackButton={true}
      refreshing={refreshing}
      onRefresh={handleRefresh}
      withBottomTabInset={true}
      headerRight={
        <AppButton
          title="Reset"
          size="sm"
          variant="ghost"
          onPress={() => {
            setEmail('');
            setPassword('');
            setStateTab('none');
          }}
        />
      }
    >
      {/* 1. Card Section */}
      <AppCard
        title="1. AppCard Component"
        subtitle="Adaptive themed container card"
        footer={
          <ThemedText style={styles.footerNote}>
            💡 Supports automatic header, body, and footer slots.
          </ThemedText>
        }
      >
        <ThemedText style={styles.bodyText}>
          This is an example text inside the card. The card automatically adapts its background color based on the active Light or Dark theme.
        </ThemedText>
      </AppCard>

      {/* 2. Form Input Section */}
      <AppCard
        title="2. AppInput Component"
        subtitle="Form text input with label & validation feedback"
      >
        <AppInput
          label="Email Address"
          placeholder="name@domain.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          helper="Enter your primary active email"
        />

        <AppInput
          label="Password"
          placeholder="Minimum 8 characters"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
          error={password && password.length < 8 ? 'Password is too short' : undefined}
        />
      </AppCard>

      {/* 3. Button Variants Section */}
      <AppCard
        title="3. AppButton Component"
        subtitle="Button variants, sizes, and loading state"
      >
        <View style={styles.buttonGroup}>
          <AppButton
            title="Primary Button"
            variant="primary"
            loading={isSubmitting}
            onPress={handleSubmit}
          />
          <AppButton
            title="Secondary Button"
            variant="secondary"
            onPress={() => alert('Secondary clicked')}
          />
          <AppButton
            title="Outline Button"
            variant="outline"
            onPress={() => alert('Outline clicked')}
          />
          <AppButton
            title="Danger Button"
            variant="danger"
            onPress={() => alert('Danger clicked')}
          />
        </View>
      </AppCard>

      {/* 4. State View Previews */}
      <AppCard
        title="4. StateView Component"
        subtitle="Loading, Error, and Empty state feedback"
      >
        <View style={styles.tabRow}>
          <AppButton
            title="None"
            size="sm"
            variant={stateTab === 'none' ? 'primary' : 'outline'}
            onPress={() => setStateTab('none')}
          />
          <AppButton
            title="Loading"
            size="sm"
            variant={stateTab === 'loading' ? 'primary' : 'outline'}
            onPress={() => setStateTab('loading')}
          />
          <AppButton
            title="Error"
            size="sm"
            variant={stateTab === 'error' ? 'primary' : 'outline'}
            onPress={() => setStateTab('error')}
          />
          <AppButton
            title="Empty"
            size="sm"
            variant={stateTab === 'empty' ? 'primary' : 'outline'}
            onPress={() => setStateTab('empty')}
          />
        </View>

        {stateTab === 'loading' && (
          <StateView type="loading" message="Loading data from server..." />
        )}
        {stateTab === 'error' && (
          <StateView
            type="error"
            title="Failed to Load Profile"
            message="Server could not be reached. Please try again."
            onRetry={() => alert('Retry triggered!')}
          />
        )}
        {stateTab === 'empty' && (
          <StateView
            type="empty"
            title="Cart is Empty"
            message="You haven't added any items to your shopping cart yet."
            actionText="Start Shopping"
            onAction={() => alert('Shop clicked!')}
          />
        )}
      </AppCard>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  bodyText: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  footerNote: {
    fontSize: 12,
    opacity: 0.5,
  },
  buttonGroup: {
    gap: Spacing.two,
  },
  tabRow: {
    flexDirection: 'row',
    gap: Spacing.one,
    flexWrap: 'wrap',
    marginBottom: Spacing.two,
  },
});
