import React from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { ErrorBoundary } from '@/components/feedback/error-boundary';
import { AuthProvider } from '@/context/auth-context';
import { ThemeProviderWrapper, useThemeMode } from '@/context/theme-context';

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { colorScheme } = useThemeMode();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(app)" />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <ThemeProviderWrapper>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </ThemeProviderWrapper>
    </ErrorBoundary>
  );
}
