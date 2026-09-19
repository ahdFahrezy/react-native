import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { SymbolView } from 'expo-symbols';
import { Pressable, useColorScheme, View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { ExternalLink } from './external-link';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { ThemeToggle } from './ui/theme-toggle';

import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/hooks/use-auth';

export default function AppTabs() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          {isAdmin && (
            <TabTrigger name="home" href="/home" asChild>
              <TabButton>Dashboard</TabButton>
            </TabTrigger>
          )}

          <TabTrigger name="admissions" href="/admissions" asChild>
            <TabButton>{isAdmin ? 'PPDB Portal' : 'PPDB Registration'}</TabButton>
          </TabTrigger>

          <TabTrigger name="explore" href="/explore" asChild>
            <TabButton>Articles</TabButton>
          </TabTrigger>

          <TabTrigger name="template-demo" href="/template-demo" asChild>
            <TabButton>Templates</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export function TabButton({ children, isFocused, ...props }: TabTriggerSlotProps) {
  const theme = useTheme();

  return (
    <Pressable {...props} style={({ pressed }) => pressed && styles.pressed}>
      <ThemedView
        type={isFocused ? 'backgroundSelected' : 'backgroundElement'}
        style={styles.tabButtonView}>
        <ThemedText
          type="small"
          style={{
            color: isFocused ? theme.text : theme.textSecondary,
            fontWeight: isFocused ? '700' : '500',
          }}>
          {children}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  const theme = useTheme();
  const { user, login, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  const handleToggleRole = async () => {
    if (user?.role === 'admin') {
      await login({ email: 'student@example.com', password: 'password123' });
      router.replace('/admissions');
    } else {
      await login({ email: 'admin@example.com', password: 'password123' });
      router.replace('/home');
    }
  };

  return (
    <View {...props} style={styles.tabListContainer}>
      <ThemedView
        type="backgroundElement"
        style={[
          styles.innerContainer,
          { borderColor: theme.border, borderWidth: 1 },
        ]}>
        <ThemedText type="smallBold" style={styles.brandText}>
          🎓 EduCMS
        </ThemedText>

        {props.children}

        <View style={styles.rightControls}>
          <Pressable
            onPress={handleToggleRole}
            style={({ pressed }) => [styles.userPill, pressed && { opacity: 0.7 }]}
          >
            <ThemedText style={styles.userRoleText}>
              {user?.role === 'admin' ? '👑 Admin (Switch ➔)' : '🎓 Student (Switch ➔)'}
            </ThemedText>
          </Pressable>

          <ThemeToggle />

          <Pressable onPress={handleLogout} style={styles.logoutBtn}>
            <ThemedText style={styles.logoutText}>Exit</ThemedText>
          </Pressable>
        </View>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: 'absolute',
    width: '100%',
    padding: Spacing.three,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  innerContainer: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.five,
    borderRadius: Spacing.five,
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    gap: Spacing.two,
    maxWidth: MaxContentWidth,
  },
  brandText: {
    marginRight: 'auto',
  },
  pressed: {
    opacity: 0.7,
  },
  tabButtonView: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.three,
  },
  externalPressable: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.one,
    marginLeft: Spacing.three,
  },
  rightControls: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  userPill: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: 'rgba(13, 148, 136, 0.15)',
  },
  userRoleText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0D9488',
  },
  logoutBtn: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
  },
  logoutText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#EF4444',
  },
});
