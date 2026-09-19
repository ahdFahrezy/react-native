import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
  Pressable,
  Image,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { StateView } from '@/components/ui/state-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface DetailScreenLayoutProps {
  title?: string;
  subtitle?: string;
  heroImageUri?: string;
  heroBadge?: React.ReactNode;
  headerRight?: React.ReactNode;
  showBackButton?: boolean;
  onBackPress?: () => void;
  children: React.ReactNode;
  bottomBar?: React.ReactNode;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  refreshing?: boolean;
  onRefresh?: () => void | Promise<void>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  withBottomTabInset?: boolean;
}

export function DetailScreenLayout({
  title,
  subtitle,
  heroImageUri,
  heroBadge,
  headerRight,
  showBackButton = true,
  onBackPress,
  children,
  bottomBar,
  loading = false,
  error = null,
  onRetry,
  refreshing = false,
  onRefresh,
  contentContainerStyle,
  withBottomTabInset = false,
}: DetailScreenLayoutProps) {
  const router = useRouter();
  const theme = useTheme();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
        {/* Navigation Bar */}
        <View style={styles.navBar}>
          {showBackButton ? (
            <Pressable
              onPress={handleBack}
              hitSlop={12}
              style={({ pressed }) => [
                styles.backButton,
                pressed && styles.pressed,
              ]}
            >
              <ThemedText style={styles.backChevron}>‹</ThemedText>
            </Pressable>
          ) : (
            <View style={styles.placeholder} />
          )}

          <ThemedText
            numberOfLines={1}
            type="subtitle"
            style={styles.navTitle}
          >
            {title || ''}
          </ThemedText>

          {headerRight ? (
            <View style={styles.navRight}>{headerRight}</View>
          ) : (
            <View style={styles.placeholder} />
          )}
        </View>

        {loading ? (
          <StateView type="loading" message="Loading details..." style={styles.centerView} />
        ) : error ? (
          <StateView
            type="error"
            message={error}
            onRetry={onRetry}
            style={styles.centerView}
          />
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[
              styles.scrollContent,
              withBottomTabInset && { paddingBottom: BottomTabInset + Spacing.four },
              contentContainerStyle,
            ]}
            refreshControl={
              onRefresh ? (
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor="#007AFF"
                />
              ) : undefined
            }
          >
            {heroImageUri && (
              <Image
                source={{ uri: heroImageUri }}
                style={styles.heroImage}
                resizeMode="cover"
              />
            )}

            {(title || subtitle || heroBadge) && (
              <View style={styles.heroHeader}>
                {heroBadge && <View style={styles.badgeWrapper}>{heroBadge}</View>}
                {title && (
                  <ThemedText type="title" style={styles.heroTitle}>
                    {title}
                  </ThemedText>
                )}
                {subtitle && (
                  <ThemedText style={styles.heroSubtitle}>
                    {subtitle}
                  </ThemedText>
                )}
              </View>
            )}

            <View style={styles.body}>{children}</View>
          </ScrollView>
        )}

        {/* Sticky Bottom Bar */}
        {bottomBar && (
          <View
            style={[
              styles.bottomBarWrapper,
              {
                backgroundColor: theme.background,
                borderTopColor: theme.backgroundSelected,
              },
              withBottomTabInset && { paddingBottom: BottomTabInset },
            ]}
          >
            <View style={styles.bottomBarContent}>{bottomBar}</View>
          </View>
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  navBar: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
  },
  backButton: {
    paddingRight: Spacing.one,
    paddingVertical: Spacing.one,
  },
  backChevron: {
    fontSize: 32,
    lineHeight: 32,
    fontWeight: '300',
    color: '#007AFF',
  },
  navTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: Spacing.two,
  },
  navRight: {
    minWidth: 32,
    alignItems: 'flex-end',
  },
  placeholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.six,
  },
  heroImage: {
    width: '100%',
    height: 220,
    backgroundColor: '#00000010',
  },
  heroHeader: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.two,
    gap: Spacing.one,
  },
  badgeWrapper: {
    marginBottom: Spacing.one,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  heroSubtitle: {
    fontSize: 14,
    opacity: 0.65,
    lineHeight: 20,
  },
  body: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
    marginTop: Spacing.two,
  },
  bottomBarWrapper: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  bottomBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  centerView: {
    flex: 1,
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
});
