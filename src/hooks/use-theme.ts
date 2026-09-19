import { useThemeMode } from '@/context/theme-context';

export function useTheme() {
  const { theme } = useThemeMode();
  return theme;
}

