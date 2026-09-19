import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';
import { SecureStorage } from '@/storage/secureStorage';
import { logger } from '@/utils/logger';

const log = logger.createScope('ThemeContext');

export type ThemeMode = 'system' | 'light' | 'dark';

export type ThemeTokens = (typeof Colors)[keyof typeof Colors];

export interface ThemeContextValue {
  mode: ThemeMode;
  colorScheme: 'light' | 'dark';
  isDark: boolean;
  setMode: (mode: ThemeMode) => Promise<void>;
  toggleTheme: () => Promise<void>;
  theme: ThemeTokens;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProviderWrapper({ children }: { children: React.ReactNode }) {
  const systemScheme = useRNColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');

  useEffect(() => {
    async function loadPersistedTheme() {
      try {
        const stored = await SecureStorage.getThemeMode();
        if (stored) {
          log.info(`Restored persisted theme mode: ${stored}`);
          setModeState(stored);
        }
      } catch (err) {
        log.warn('Failed to restore theme mode', err);
      }
    }
    loadPersistedTheme();
  }, []);

  const setMode = useCallback(async (newMode: ThemeMode) => {
    log.info(`Setting theme mode: ${newMode}`);
    setModeState(newMode);
    await SecureStorage.setThemeMode(newMode);
  }, []);

  const toggleTheme = useCallback(async () => {
    // If currently dark, switch to light; otherwise switch to dark
    const currentEffective = mode === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : mode;
    const nextMode = currentEffective === 'dark' ? 'light' : 'dark';
    await setMode(nextMode);
  }, [mode, systemScheme, setMode]);

  const resolvedScheme: 'light' | 'dark' = useMemo(() => {
    if (mode === 'light') return 'light';
    if (mode === 'dark') return 'dark';
    return systemScheme === 'dark' ? 'dark' : 'light';
  }, [mode, systemScheme]);

  const activeTheme = useMemo(() => {
    return Colors[resolvedScheme];
  }, [resolvedScheme]);

  const value = useMemo(
    () => ({
      mode,
      colorScheme: resolvedScheme,
      isDark: resolvedScheme === 'dark',
      setMode,
      toggleTheme,
      theme: activeTheme,
    }),
    [mode, resolvedScheme, setMode, toggleTheme, activeTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeMode() {
  const context = useContext(ThemeContext);
  if (!context) {
    // Graceful fallback if invoked outside provider
    return {
      mode: 'system' as ThemeMode,
      colorScheme: 'light' as const,
      isDark: false,
      setMode: async () => {},
      toggleTheme: async () => {},
      theme: Colors.light,
    };
  }
  return context;
}
