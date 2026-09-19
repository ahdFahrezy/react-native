import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { AppButton } from '@/components/ui/app-button';
import { AppInput } from '@/components/ui/app-input';
import { AppBadge } from '@/components/ui/app-badge';
import { AppDivider } from '@/components/ui/app-divider';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { useTheme } from '@/hooks/use-theme';

export default function LoginScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { login, isAuthenticated, user, isLoading, error, clearError } = useAuth();

  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password123');
  const [selectedRole, setSelectedRole] = useState<'admin' | 'student' | 'custom'>('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(true);

  // Auto-redirect based on role if session is active
  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'admin') {
        router.replace('/home');
      } else {
        router.replace('/admissions');
      }
    }
  }, [isAuthenticated, user, router]);

  const handleSelectRole = (role: 'admin' | 'student') => {
    setSelectedRole(role);
    clearError();
    setFormError(null);
    if (role === 'admin') {
      setEmail('admin@example.com');
      setPassword('password123');
    } else {
      setEmail('student@example.com');
      setPassword('password123');
    }
  };

  const handleLogin = async () => {
    Keyboard.dismiss();
    clearError();
    setFormError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setFormError('Email address is required.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setFormError('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return;
    }

    try {
      await login({ email: trimmedEmail, password, rememberMe });
      if (trimmedEmail.toLowerCase().includes('admin')) {
        router.replace('/home');
      } else {
        router.replace('/admissions');
      }
    } catch {
      // Error handled by AuthContext
    }
  };

  const handleGuestLogin = async () => {
    clearError();
    setFormError(null);
    try {
      await login({ email: 'guest@example.com', password: 'password123', rememberMe: false });
      router.replace('/admissions');
    } catch {
      // Error handled by AuthContext
    }
  };

  return (
    <ThemedView style={styles.outerContainer}>
      {/* Ambient background glow for rich aesthetic */}
      <View style={styles.ambientGlow} pointerEvents="none" />

      <SafeAreaView edges={['top', 'left', 'right', 'bottom']} style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoid}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Theme Toggle Bar */}
              <View style={styles.topToggleRow}>
                <ThemeToggle />
              </View>

              {/* Main Card Container */}
              <View
                style={[
                  styles.loginCard,
                  {
                    backgroundColor:
                      Platform.OS === 'web'
                        ? 'rgba(21, 23, 28, 0.88)'
                        : theme.backgroundElement,
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                  },
                ]}
              >
                {/* Brand Header */}
                <View style={styles.brandHeader}>
                  <View style={styles.logoBadge}>
                    <ThemedText style={{ fontSize: 26 }}>🎓</ThemedText>
                  </View>
                  <ThemedText style={styles.brandTitle}>EduCMS Portal</ThemedText>
                  <ThemedText style={styles.brandSubtitle}>
                    Bintang Bangsa School Administration
                  </ThemedText>
                </View>

                {/* Demo Quick-Select Tabs */}
                <View style={styles.demoSection}>
                  <ThemedText style={styles.demoLabel}>Select Account Role</ThemedText>
                  <View style={styles.demoButtonGroup}>
                    <Pressable
                      onPress={() => handleSelectRole('admin')}
                      style={[
                        styles.demoButton,
                        selectedRole === 'admin' && styles.demoButtonActive,
                        { borderColor: selectedRole === 'admin' ? '#0D9488' : 'rgba(255, 255, 255, 0.12)' },
                      ]}
                    >
                      <ThemedText style={styles.demoButtonIcon}>👑</ThemedText>
                      <View style={styles.demoButtonTextCol}>
                        <ThemedText style={styles.demoButtonRole}>CMS Administrator</ThemedText>
                        <ThemedText style={styles.demoButtonEmail}>admin@example.com (Verification & Stats)</ThemedText>
                      </View>
                      {selectedRole === 'admin' && (
                        <AppBadge label="Admin View" variant="primary" size="sm" dot />
                      )}
                    </Pressable>

                    <Pressable
                      onPress={() => handleSelectRole('student')}
                      style={[
                        styles.demoButton,
                        selectedRole === 'student' && styles.demoButtonActive,
                        { borderColor: selectedRole === 'student' ? '#0D9488' : 'rgba(255, 255, 255, 0.12)' },
                      ]}
                    >
                      <ThemedText style={styles.demoButtonIcon}>🎓</ThemedText>
                      <View style={styles.demoButtonTextCol}>
                        <ThemedText style={styles.demoButtonRole}>Student Applicant</ThemedText>
                        <ThemedText style={styles.demoButtonEmail}>student@example.com (PPDB Online Form)</ThemedText>
                      </View>
                      {selectedRole === 'student' && (
                        <AppBadge label="Student View" variant="success" size="sm" dot />
                      )}
                    </Pressable>
                  </View>
                </View>

                <AppDivider label="CREDENTIALS" spacing={Spacing.two} />

                {/* Inputs */}
                <View style={styles.formGroup}>
                  <AppInput
                    label="Email Address"
                    placeholder="name@company.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={email}
                    onChangeText={(val) => {
                      setEmail(val);
                      setSelectedRole('custom');
                      if (formError) setFormError(null);
                    }}
                  />

                  <View style={styles.passwordWrapper}>
                    <AppInput
                      label="Password"
                      placeholder="Minimum 6 characters"
                      secureTextEntry={!showPassword}
                      value={password}
                      onChangeText={(val) => {
                        setPassword(val);
                        setSelectedRole('custom');
                        if (formError) setFormError(null);
                      }}
                      rightIcon={
                        <Pressable
                          onPress={() => setShowPassword(!showPassword)}
                          hitSlop={8}
                          style={styles.eyeToggle}
                        >
                          <ThemedText style={styles.eyeIcon}>
                            {showPassword ? 'Hide' : 'Show'}
                          </ThemedText>
                        </Pressable>
                      }
                    />
                  </View>
                </View>

                {/* Remember Me & Forgot Password Row */}
                <View style={styles.optionsRow}>
                  <Pressable
                    onPress={() => setRememberMe(!rememberMe)}
                    style={styles.rememberMeContainer}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        rememberMe && styles.checkboxActive,
                        { borderColor: rememberMe ? '#007AFF' : theme.textSecondary },
                      ]}
                    >
                      {rememberMe && <ThemedText style={styles.checkmark}>✓</ThemedText>}
                    </View>
                    <ThemedText style={styles.optionsText}>Remember me</ThemedText>
                  </Pressable>

                  <Pressable onPress={() => alert('Password reset link sent to registered email.')}>
                    <ThemedText style={styles.forgotPasswordText}>Forgot password?</ThemedText>
                  </Pressable>
                </View>

                {/* Error Banner */}
                {(formError || error) && (
                  <View style={styles.errorBanner}>
                    <ThemedText style={styles.errorText}>
                      ⚠️ {formError || error}
                    </ThemedText>
                  </View>
                )}

                {/* Submit Buttons */}
                <View style={styles.actionSection}>
                  <AppButton
                    title="Sign In"
                    variant="primary"
                    size="lg"
                    loading={isLoading}
                    onPress={handleLogin}
                  />

                  <AppButton
                    title="Explore as Guest ➔"
                    variant="outline"
                    size="md"
                    onPress={handleGuestLogin}
                  />
                </View>

                {/* Footer Security Notice */}
                <View style={styles.cardFooter}>
                  <ThemedText style={styles.footerNote}>
                    🔒 Enterprise-grade JWT token encryption with secure storage
                  </ThemedText>
                </View>
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#090A0E',
    position: 'relative',
  },
  ambientGlow: {
    position: 'absolute',
    top: -120,
    left: '50%',
    width: 600,
    height: 400,
    marginLeft: -300,
    borderRadius: 300,
    backgroundColor: '#007AFF',
    opacity: 0.12,
    // Radial blur filter simulation for web
    ...(Platform.OS === 'web'
      ? {
          filter: 'blur(100px)',
        }
      : {}),
  },
  safeArea: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.six,
  },
  loginCard: {
    width: '100%',
    maxWidth: 450,
    borderRadius: 24,
    borderWidth: 1,
    padding: Spacing.four,
    gap: Spacing.three,
    // Modern elevation shadow
    ...(Platform.OS === 'web'
      ? {
          boxShadow: '0 24px 60px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
        }
      : {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.35,
          shadowRadius: 20,
          elevation: 10,
        }),
  },
  brandHeader: {
    alignItems: 'center',
    gap: Spacing.one,
    paddingTop: Spacing.one,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.two,
    ...(Platform.OS === 'web'
      ? {
          boxShadow: '0 8px 24px rgba(0, 122, 255, 0.4)',
        }
      : {}),
  },
  logoImage: {
    width: 38,
    height: 38,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  brandSubtitle: {
    fontSize: 14,
    opacity: 0.65,
    textAlign: 'center',
    maxWidth: 320,
    lineHeight: 20,
  },
  demoSection: {
    gap: Spacing.one,
  },
  demoLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    opacity: 0.6,
    marginBottom: 2,
  },
  demoButtonGroup: {
    gap: Spacing.two,
  },
  demoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.two,
    borderRadius: 12,
    borderWidth: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    gap: Spacing.two,
  },
  demoButtonActive: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  demoButtonIcon: {
    fontSize: 18,
  },
  demoButtonTextCol: {
    flex: 1,
    gap: 2,
  },
  demoButtonRole: {
    fontSize: 13,
    fontWeight: '600',
  },
  demoButtonEmail: {
    fontSize: 11,
    opacity: 0.5,
  },
  formGroup: {
    gap: Spacing.three,
  },
  passwordWrapper: {
    position: 'relative',
  },
  eyeToggle: {
    paddingHorizontal: Spacing.one,
    paddingVertical: 4,
  },
  eyeIcon: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
  },
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.half,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: '#007AFF',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  optionsText: {
    fontSize: 13,
    opacity: 0.7,
  },
  forgotPasswordText: {
    fontSize: 13,
    color: '#007AFF',
    fontWeight: '500',
  },
  errorBanner: {
    backgroundColor: 'rgba(255, 59, 48, 0.12)',
    borderColor: 'rgba(255, 59, 48, 0.3)',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  actionSection: {
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  cardFooter: {
    alignItems: 'center',
    paddingTop: Spacing.one,
  },
  footerNote: {
    fontSize: 11,
    opacity: 0.45,
    textAlign: 'center',
    lineHeight: 16,
  },
  topToggleRow: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.two,
  },
});

