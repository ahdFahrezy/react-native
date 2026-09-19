import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface ScreenLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  headerRight?: React.ReactNode;
  footer?: React.ReactNode;
  scrollable?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void | Promise<void>;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  withBottomTabInset?: boolean;
}

export function ScreenLayout({
  children,
  title,
  subtitle,
  showBackButton = false,
  onBackPress,
  headerRight,
  footer,
  scrollable = true,
  refreshing = false,
  onRefresh,
  style,
  contentStyle,
  withBottomTabInset = false,
}: ScreenLayoutProps) {
  const router = useRouter();
  const theme = useTheme();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else if (router.canGoBack()) {
      router.back();
    }
  };

  const hasHeader = title || subtitle || showBackButton || headerRight;

  const content = scrollable ? (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[
        styles.scrollContent,
        withBottomTabInset && { paddingBottom: BottomTabInset + Spacing.four },
        contentStyle,
      ]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.text}
          />
        ) : undefined
      }
    >
      {children}
    </ScrollView>
  ) : (
    <View
      style={[
        styles.fixedContent,
        withBottomTabInset && { paddingBottom: BottomTabInset + Spacing.four },
        contentStyle,
      ]}
    >
      {children}
    </View>
  );

  return (
    <ThemedView style={[styles.root, style]}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}
        >
          {hasHeader && (
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                {showBackButton && (
                  <Pressable
                    onPress={handleBack}
                    style={({ pressed }) => [
                      styles.backButton,
                      { backgroundColor: theme.backgroundElement },
                      pressed && styles.backButtonPressed,
                    ]}
                  >
                    <ThemedText style={styles.backArrow}>‹</ThemedText>
                  </Pressable>
                )}
                <View style={styles.titleWrapper}>
                  {title && <ThemedText type="subtitle">{title}</ThemedText>}
                  {subtitle && (
                    <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
                  )}
                </View>
              </View>

              {headerRight && <View style={styles.headerRight}>{headerRight}</View>}
            </View>
          )}

          <View style={styles.body}>{content}</View>

          {footer && <View style={styles.footer}>{footer}</View>}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
  },
  keyboardView: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(150, 150, 150, 0.15)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    flex: 1,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonPressed: {
    opacity: 0.7,
  },
  backArrow: {
    fontSize: 24,
    lineHeight: 26,
    fontWeight: '600',
    marginTop: -2,
  },
  titleWrapper: {
    flex: 1,
    gap: 2,
  },
  subtitle: {
    fontSize: 12,
    opacity: 0.6,
  },
  headerRight: {
    marginLeft: Spacing.two,
  },
  body: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
  fixedContent: {
    flex: 1,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  footer: {
    padding: Spacing.four,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(150, 150, 150, 0.15)',
  },
});
