import React from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  RefreshControl,
  Pressable,
  ScrollView,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AppInput } from '@/components/ui/app-input';
import { AppBadge } from '@/components/ui/app-badge';
import { StateView } from '@/components/ui/state-view';
import { AppSkeleton } from '@/components/ui/app-skeleton';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface FilterOption {
  label: string;
  value: string;
}

export interface ListScreenLayoutProps<T> {
  data: T[];
  renderItem: (info: { item: T; index: number }) => React.ReactElement | null;
  keyExtractor: (item: T, index: number) => string;
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  headerRight?: React.ReactNode;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  filterOptions?: FilterOption[];
  activeFilter?: string;
  onFilterChange?: (value: string) => void;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyMessage?: string;
  emptyActionText?: string;
  onEmptyAction?: () => void;
  refreshing?: boolean;
  onRefresh?: () => void | Promise<void>;
  onAddPress?: () => void;
  addLabel?: string;
  contentContainerStyle?: StyleProp<ViewStyle>;
  ListHeaderComponent?: React.ReactElement | null;
  withBottomTabInset?: boolean;
}

export function ListScreenLayout<T>({
  data,
  renderItem,
  keyExtractor,
  title,
  subtitle,
  showBackButton = false,
  onBackPress,
  headerRight,
  searchable = false,
  searchPlaceholder = 'Search items...',
  searchQuery,
  onSearchChange,
  filterOptions,
  activeFilter,
  onFilterChange,
  loading = false,
  error = null,
  onRetry,
  emptyTitle = 'No Items Found',
  emptyMessage = 'No records match your query.',
  emptyActionText,
  onEmptyAction,
  refreshing = false,
  onRefresh,
  onAddPress,
  contentContainerStyle,
  ListHeaderComponent,
  withBottomTabInset = false,
}: ListScreenLayoutProps<T>) {
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

  const renderHeader = () => {
    return (
      <View style={styles.headerSection}>
        {(title || showBackButton || headerRight) && (
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
                {title && (
                  <ThemedText type="subtitle" style={styles.headerTitle}>
                    {title}
                  </ThemedText>
                )}
                {subtitle && (
                  <ThemedText style={styles.headerSubtitle}>
                    {subtitle}
                  </ThemedText>
                )}
              </View>
            </View>
            {headerRight && <View style={styles.navRight}>{headerRight}</View>}
          </View>
        )}

        {searchable && (
          <View style={styles.searchWrapper}>
            <AppInput
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChangeText={onSearchChange}
              leftIcon={<ThemedText style={styles.searchIcon}>🔍</ThemedText>}
              rightIcon={
                searchQuery && onSearchChange ? (
                  <Pressable onPress={() => onSearchChange('')} hitSlop={8}>
                    <ThemedText style={styles.clearIcon}>✕</ThemedText>
                  </Pressable>
                ) : null
              }
            />
          </View>
        )}

        {filterOptions && filterOptions.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
            {filterOptions.map((opt) => {
              const isSelected = activeFilter === opt.value;
              return (
                <Pressable
                  key={opt.value}
                  onPress={() => onFilterChange?.(opt.value)}
                  style={({ pressed }) => pressed && styles.pressed}
                >
                  <AppBadge
                    label={opt.label}
                    variant={isSelected ? 'primary' : 'neutral'}
                    size="md"
                  />
                </Pressable>
              );
            })}
          </ScrollView>
        )}

        {ListHeaderComponent}
      </View>
    );
  };

  const renderContent = () => {
    if (loading && data.length === 0) {
      return (
        <View style={styles.loadingList}>
          {[1, 2, 3, 4, 5].map((key) => (
            <View
              key={key}
              style={[
                styles.skeletonCard,
                { backgroundColor: theme.backgroundElement },
              ]}
            >
              <AppSkeleton width="60%" height={16} borderRadius={4} />
              <AppSkeleton width="90%" height={12} borderRadius={4} />
              <AppSkeleton width="40%" height={12} borderRadius={4} />
            </View>
          ))}
        </View>
      );
    }

    if (error && data.length === 0) {
      return (
        <StateView
          type="error"
          message={error}
          onRetry={onRetry}
          style={styles.stateCenter}
        />
      );
    }

    return (
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#007AFF"
            />
          ) : undefined
        }
        ListEmptyComponent={
          <StateView
            type="empty"
            title={emptyTitle}
            message={emptyMessage}
            actionText={emptyActionText}
            onAction={onEmptyAction}
            style={styles.stateCenter}
          />
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={[
          styles.flatListContent,
          withBottomTabInset && { paddingBottom: BottomTabInset + Spacing.four },
          contentContainerStyle,
        ]}
      />
    );
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
        <View style={styles.contentWrapper}>
          {renderHeader()}
          <View style={styles.listSection}>{renderContent()}</View>
        </View>

        {onAddPress && (
          <Pressable
            onPress={onAddPress}
            style={({ pressed }) => [
              styles.fab,
              withBottomTabInset && { bottom: BottomTabInset + Spacing.three },
              pressed && styles.fabPressed,
            ]}
          >
            <ThemedText style={styles.fabIcon}>+</ThemedText>
          </Pressable>
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
  contentWrapper: {
    flex: 1,
  },
  headerSection: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.two,
    gap: Spacing.two,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
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
  searchWrapper: {
    marginTop: Spacing.one,
  },
  searchIcon: {
    fontSize: 14,
    opacity: 0.6,
  },
  clearIcon: {
    fontSize: 12,
    opacity: 0.6,
    padding: Spacing.one,
  },
  filterRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    paddingVertical: Spacing.one,
  },
  listSection: {
    flex: 1,
  },
  flatListContent: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    flexGrow: 1,
  },
  separator: {
    height: Spacing.two,
  },
  loadingList: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
  skeletonCard: {
    borderRadius: 14,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  stateCenter: {
    marginTop: Spacing.six,
  },
  fab: {
    position: 'absolute',
    right: Spacing.four,
    bottom: Spacing.four,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  fabPressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.9,
  },
  fabIcon: {
    color: '#ffffff',
    fontSize: 30,
    lineHeight: 32,
    fontWeight: '300',
    marginTop: -2,
  },
  pressed: {
    opacity: 0.7,
  },
});
