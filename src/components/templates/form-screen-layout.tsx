import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AppButton } from '@/components/ui/app-button';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface FormScreenLayoutProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  headerRight?: React.ReactNode;
  children: React.ReactNode;
  submitLabel?: string;
  onSubmit?: () => void;
  isSubmitting?: boolean;
  isSubmitDisabled?: boolean;
  secondaryAction?: React.ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  withBottomTabInset?: boolean;
}

export function FormScreenLayout({
  title,
  subtitle,
  showBackButton = true,
  onBackPress,
  headerRight,
  children,
  submitLabel = 'Submit',
  onSubmit,
  isSubmitting = false,
  isSubmitDisabled = false,
  secondaryAction,
  contentContainerStyle,
  withBottomTabInset = false,
}: FormScreenLayoutProps) {
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
        <KeyboardAvoidingView
          style={styles.keyboardAvoid}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 12 : 0}
        >
          {/* Header */}
          <View style={styles.navBar}>
            <View style={styles.navLeft}>
              {showBackButton && (
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
              )}
              <View style={styles.titleContainer}>
                <ThemedText type="subtitle" style={styles.headerTitle}>
                  {title}
                </ThemedText>
                {subtitle && (
                  <ThemedText style={styles.headerSubtitle}>
                    {subtitle}
                  </ThemedText>
                )}
              </View>
            </View>
            {headerRight && <View style={styles.navRight}>{headerRight}</View>}
          </View>

          {/* Form Body with tap outside to dismiss keyboard */}
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={[
                styles.scrollContent,
                contentContainerStyle,
              ]}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {children}
            </ScrollView>
          </TouchableWithoutFeedback>

          {/* Sticky Bottom Submit Bar */}
          {onSubmit && (
            <View
              style={[
                styles.bottomBar,
                {
                  backgroundColor: theme.background,
                  borderTopColor: theme.backgroundSelected,
                },
                withBottomTabInset && { paddingBottom: BottomTabInset },
              ]}
            >
              <View style={styles.actionsContainer}>
                {secondaryAction}
                <AppButton
                  title={submitLabel}
                  variant="primary"
                  size="lg"
                  loading={isSubmitting}
                  disabled={isSubmitDisabled}
                  onPress={onSubmit}
                  style={styles.submitButton}
                />
              </View>
            </View>
          )}
        </KeyboardAvoidingView>
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
  keyboardAvoid: {
    flex: 1,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.two,
    minHeight: 48,
  },
  navLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    flex: 1,
  },
  titleContainer: {
    flex: 1,
    gap: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 13,
    opacity: 0.6,
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
  navRight: {
    marginLeft: Spacing.two,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    gap: Spacing.three,
    paddingBottom: Spacing.six,
  },
  bottomBar: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  submitButton: {
    flex: 1,
  },
  pressed: {
    opacity: 0.7,
  },
});
