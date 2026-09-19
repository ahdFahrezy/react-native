import { useThemeMode } from '@/context/theme-context';

export function useColorScheme() {
  const { colorScheme } = useThemeMode();
  return colorScheme;
}

