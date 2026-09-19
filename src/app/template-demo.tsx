import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { ScreenLayout } from '@/components/templates/screen-layout';
import { ListScreenLayout } from '@/components/templates/list-screen-layout';
import { DetailScreenLayout } from '@/components/templates/detail-screen-layout';
import { FormScreenLayout } from '@/components/templates/form-screen-layout';
import {
  AppButton,
  AppCard,
  AppInput,
  AppBadge,
  AppAvatar,
  AppDivider,
  AppSkeleton,
  AppModal,
  StateView,
} from '@/components/ui';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

type TabKey = 'ui-kit' | 'list-template' | 'form-template' | 'detail-template' | 'states-modal';

interface DemoListItem {
  id: string;
  name: string;
  category: string;
  status: 'active' | 'pending' | 'completed';
  role: string;
}

const INITIAL_DEMO_ITEMS: DemoListItem[] = [
  { id: '1', name: 'Alex Johnson', category: 'Engineering', status: 'active', role: 'Staff Software Engineer' },
  { id: '2', name: 'Sarah Connor', category: 'Product', status: 'pending', role: 'Senior Product Manager' },
  { id: '3', name: 'Michael Scott', category: 'Operations', status: 'completed', role: 'Regional Director' },
  { id: '4', name: 'Elena Rostova', category: 'Design', status: 'active', role: 'Lead Product Designer' },
  { id: '5', name: 'David Kim', category: 'Engineering', status: 'active', role: 'Mobile Specialist' },
];

export default function TemplateDemoScreen() {
  const [activeTab, setActiveTab] = useState<TabKey>('ui-kit');

  // UI Kit Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalActionLoading, setModalActionLoading] = useState(false);

  // State View Selector
  const [stateTab, setStateTab] = useState<'none' | 'loading' | 'error' | 'empty'>('none');

  // List Template States
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [listRefreshing, setListRefreshing] = useState(false);
  const [items, setItems] = useState<DemoListItem[]>(INITIAL_DEMO_ITEMS);

  // Form Template States
  const [formName, setFormName] = useState('John Doe');
  const [formEmail, setFormEmail] = useState('john.doe@company.com');
  const [formRole, setFormRole] = useState('Senior Engineer');
  const [formSaving, setFormSaving] = useState(false);

  // Handlers
  const handleRefreshList = async () => {
    setListRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setItems(INITIAL_DEMO_ITEMS);
    setListRefreshing(false);
  };

  const handleModalConfirm = async () => {
    setModalActionLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setModalActionLoading(false);
    setIsModalOpen(false);
    Alert.alert('Action Confirmed', 'The confirmed operation completed successfully.');
  };

  const handleFormSubmit = async () => {
    setFormSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setFormSaving(false);
    Alert.alert('Form Saved', `Successfully updated profile for ${formName}`);
  };

  // Filter items for List Template
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      activeFilter === 'all' || item.category.toLowerCase() === activeFilter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  // Tab 2: Interactive List Screen Template
  if (activeTab === 'list-template') {
    return (
      <ListScreenLayout
        title="List Screen Template"
        subtitle="Live FlatList with search & filter chips"
        showBackButton={true}
        onBackPress={() => setActiveTab('ui-kit')}
        searchable={true}
        searchPlaceholder="Search by name or role..."
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterOptions={[
          { label: 'All', value: 'all' },
          { label: 'Engineering', value: 'engineering' },
          { label: 'Product', value: 'product' },
          { label: 'Design', value: 'design' },
          { label: 'Operations', value: 'operations' },
        ]}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        data={filteredItems}
        keyExtractor={(item) => item.id}
        refreshing={listRefreshing}
        onRefresh={handleRefreshList}
        onAddPress={() => {
          const newItem: DemoListItem = {
            id: String(Date.now()),
            name: `New Member ${items.length + 1}`,
            category: 'Engineering',
            status: 'active',
            role: 'Software Engineer',
          };
          setItems([newItem, ...items]);
        }}
        renderItem={({ item }) => (
          <AppCard
            title={item.name}
            subtitle={item.role}
            headerRight={
              <AppBadge
                label={item.status}
                variant={
                  item.status === 'active'
                    ? 'success'
                    : item.status === 'pending'
                    ? 'warning'
                    : 'primary'
                }
                size="sm"
                dot
              />
            }
            onPress={() => Alert.alert('Selected Item', `Clicked on ${item.name}`)}
          >
            <View style={styles.listItemContent}>
              <AppAvatar name={item.name} size="sm" />
              <ThemedText style={styles.cardDetailText}>
                Category: <ThemedText style={{ fontWeight: '600' }}>{item.category}</ThemedText>
              </ThemedText>
            </View>
          </AppCard>
        )}
        withBottomTabInset={true}
      />
    );
  }

  // Tab 3: Interactive Form Screen Template
  if (activeTab === 'form-template') {
    return (
      <FormScreenLayout
        title="Form Screen Template"
        subtitle="Keyboard-avoiding form with sticky submit bar"
        showBackButton={true}
        onBackPress={() => setActiveTab('ui-kit')}
        submitLabel="Save Changes"
        onSubmit={handleFormSubmit}
        isSubmitting={formSaving}
        withBottomTabInset={true}
        headerRight={
          <AppButton
            title="Reset"
            size="sm"
            variant="ghost"
            onPress={() => {
              setFormName('John Doe');
              setFormEmail('john.doe@company.com');
              setFormRole('Senior Engineer');
            }}
          />
        }
      >
        <AppCard title="Personal Information" subtitle="Update public profile attributes">
          <AppInput
            label="Full Name"
            value={formName}
            onChangeText={setFormName}
            placeholder="Enter your name"
            helper="Will be shown on your profile"
          />

          <AppInput
            label="Email Address"
            value={formEmail}
            onChangeText={setFormEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="name@company.com"
          />

          <AppInput
            label="Role / Title"
            value={formRole}
            onChangeText={setFormRole}
            placeholder="e.g. Mobile Developer"
          />
        </AppCard>

        <AppCard title="Account Settings" subtitle="Security and credentials">
          <AppInput
            label="New Password"
            placeholder="Leave blank to keep current"
            secureTextEntry={true}
          />
          <AppDivider spacing={Spacing.two} />
          <ThemedText style={{ fontSize: 13, opacity: 0.7 }}>
            By submitting, changes will be persisted to your profile record.
          </ThemedText>
        </AppCard>
      </FormScreenLayout>
    );
  }

  // Tab 4: Interactive Detail Screen Template
  if (activeTab === 'detail-template') {
    return (
      <DetailScreenLayout
        title="Detail Screen Template"
        subtitle="System Architect & Tech Lead"
        showBackButton={true}
        onBackPress={() => setActiveTab('ui-kit')}
        heroBadge={
          <AppBadge label="ACTIVE MEMBER" variant="success" size="sm" dot />
        }
        bottomBar={
          <>
            <AppButton
              title="Message"
              variant="outline"
              size="md"
              style={{ flex: 1 }}
              onPress={() => Alert.alert('Message', 'Opening chat...')}
            />
            <AppButton
              title="Edit Profile"
              variant="primary"
              size="md"
              style={{ flex: 2 }}
              onPress={() => setActiveTab('form-template')}
            />
          </>
        }
        withBottomTabInset={true}
      >
        <AppCard title="About Alex Johnson" subtitle="Member Profile">
          <View style={styles.avatarRow}>
            <AppAvatar name="Alex Johnson" size="xl" status="online" />
            <View style={{ flex: 1, gap: 4 }}>
              <ThemedText style={{ fontWeight: '700', fontSize: 18 }}>Alex Johnson</ThemedText>
              <ThemedText style={{ opacity: 0.7, fontSize: 14 }}>Engineering Division</ThemedText>
              <AppBadge label="Verified Employee" variant="info" size="sm" />
            </View>
          </View>
          <AppDivider spacing={Spacing.two} />
          <ThemedText style={{ fontSize: 14, lineHeight: 22, opacity: 0.85 }}>
            Staff engineer focusing on React Native, distributed mobile architectures, and
            developer tooling. Responsible for mobile platform core libraries and performance.
          </ThemedText>
        </AppCard>

        <AppCard title="Direct Contact" subtitle="Secure communication channels">
          <ThemedText style={{ fontSize: 14, opacity: 0.8 }}>
            📧 Email: alex.johnson@example.com
          </ThemedText>
          <ThemedText style={{ fontSize: 14, opacity: 0.8 }}>
            📍 Location: San Francisco, CA
          </ThemedText>
        </AppCard>
      </DetailScreenLayout>
    );
  }

  // Default: UI Kit & Showcase
  return (
    <ScreenLayout
      title="UI Templates & Layouts"
      subtitle="Complete Component Catalog & Screen Patterns"
      showBackButton={true}
      withBottomTabInset={true}
    >
      {/* Template Navigation Switcher */}
      <View style={styles.switcherSection}>
        <ThemedText style={styles.switcherHeader}>Explore Screen Templates:</ThemedText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.switcherRow}>
          <AppButton
            title="📋 List Screen"
            size="sm"
            variant="outline"
            onPress={() => setActiveTab('list-template')}
          />
          <AppButton
            title="✍️ Form Screen"
            size="sm"
            variant="outline"
            onPress={() => setActiveTab('form-template')}
          />
          <AppButton
            title="👤 Detail Screen"
            size="sm"
            variant="outline"
            onPress={() => setActiveTab('detail-template')}
          />
        </ScrollView>
      </View>

      {/* 1. Badges & Avatars */}
      <AppCard title="1. AppBadge & AppAvatar" subtitle="Status indicators, tags, and profile images">
        <ThemedText style={styles.sectionLabel}>Badge Color Variants:</ThemedText>
        <View style={styles.badgeRow}>
          <AppBadge label="Primary" variant="primary" dot />
          <AppBadge label="Success" variant="success" dot />
          <AppBadge label="Warning" variant="warning" dot />
          <AppBadge label="Error" variant="error" dot />
          <AppBadge label="Info" variant="info" dot />
          <AppBadge label="Neutral" variant="neutral" />
          <AppBadge label="Outline" variant="outline" />
        </View>

        <ThemedText style={[styles.sectionLabel, { marginTop: Spacing.two }]}>
          Avatar Sizes & Status:
        </ThemedText>
        <View style={styles.avatarGrid}>
          <AppAvatar name="Sarah Connor" size="sm" status="online" />
          <AppAvatar name="Sarah Connor" size="md" status="busy" />
          <AppAvatar name="Sarah Connor" size="lg" status="away" />
          <AppAvatar name="Sarah Connor" size="xl" status="offline" />
        </View>
      </AppCard>

      {/* 2. Buttons */}
      <AppCard title="2. AppButton Component" subtitle="Variants, sizes, loading, and icon support">
        <View style={styles.buttonGroup}>
          <AppButton
            title="Primary Button"
            variant="primary"
            loading={isSubmitting}
            onPress={() => {
              setIsSubmitting(true);
              setTimeout(() => setIsSubmitting(false), 1200);
            }}
          />
          <AppButton
            title="Secondary Button"
            variant="secondary"
            onPress={() => Alert.alert('Button', 'Secondary clicked')}
          />
          <AppButton
            title="Outline Button"
            variant="outline"
            onPress={() => Alert.alert('Button', 'Outline clicked')}
          />
          <AppButton
            title="Danger Button"
            variant="danger"
            onPress={() => Alert.alert('Button', 'Danger clicked')}
          />
          <AppButton
            title="Ghost Button"
            variant="ghost"
            onPress={() => Alert.alert('Button', 'Ghost clicked')}
          />
        </View>
      </AppCard>

      {/* 3. Inputs & Forms */}
      <AppCard title="3. AppInput Component" subtitle="Clean inputs with focus border, icons & validation">
        <AppInput
          label="Email Address"
          placeholder="name@domain.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          helper="Enter your primary corporate email"
        />

        <AppInput
          label="Password"
          placeholder="Minimum 8 characters"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
          error={password && password.length < 8 ? 'Password must be at least 8 characters' : undefined}
        />
      </AppCard>

      {/* 4. Skeletons & Dividers */}
      <AppCard title="4. AppSkeleton & AppDivider" subtitle="Loading placeholders and section dividers">
        <ThemedText style={styles.sectionLabel}>Animated Skeleton Placeholders:</ThemedText>
        <View style={styles.skeletonBox}>
          <AppSkeleton width="80%" height={18} borderRadius={6} />
          <AppSkeleton width="100%" height={14} borderRadius={4} />
          <AppSkeleton width="60%" height={14} borderRadius={4} />
        </View>

        <AppDivider label="OR" spacing={Spacing.three} />

        <ThemedText style={{ fontSize: 13, opacity: 0.7, textAlign: 'center' }}>
          Dividers support centered text badges and thematic border adaptation.
        </ThemedText>
      </AppCard>

      {/* 5. Modals & Dialogs */}
      <AppCard title="5. AppModal Dialog" subtitle="Accessible confirmation and alert dialogs">
        <ThemedText style={{ fontSize: 14, opacity: 0.8, marginBottom: Spacing.two }}>
          Press the button below to trigger the interactive confirmation modal.
        </ThemedText>
        <AppButton
          title="Open Confirmation Modal"
          variant="outline"
          onPress={() => setIsModalOpen(true)}
        />
      </AppCard>

      {/* 6. State View Previews */}
      <AppCard title="6. StateView Component" subtitle="Loading, Error, and Empty state feedback">
        <View style={styles.tabRow}>
          <AppButton
            title="None"
            size="sm"
            variant={stateTab === 'none' ? 'primary' : 'outline'}
            onPress={() => setStateTab('none')}
          />
          <AppButton
            title="Loading"
            size="sm"
            variant={stateTab === 'loading' ? 'primary' : 'outline'}
            onPress={() => setStateTab('loading')}
          />
          <AppButton
            title="Error"
            size="sm"
            variant={stateTab === 'error' ? 'primary' : 'outline'}
            onPress={() => setStateTab('error')}
          />
          <AppButton
            title="Empty"
            size="sm"
            variant={stateTab === 'empty' ? 'primary' : 'outline'}
            onPress={() => setStateTab('empty')}
          />
        </View>

        {stateTab === 'loading' && (
          <StateView type="loading" message="Fetching fresh records from server..." />
        )}
        {stateTab === 'error' && (
          <StateView
            type="error"
            title="Connection Timeout"
            message="Server could not be reached. Please check your network connection."
            onRetry={() => Alert.alert('Retry', 'Retrying request...')}
          />
        )}
        {stateTab === 'empty' && (
          <StateView
            type="empty"
            title="No Records Found"
            message="There are currently no items in this workspace."
            actionText="Create First Record"
            onAction={() => Alert.alert('Action', 'Create triggered!')}
          />
        )}
      </AppCard>

      {/* Dialog instance */}
      <AppModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Confirm Operation"
        message="Are you sure you want to execute this action? This will update your workspace configuration."
        confirmText="Confirm"
        destructive={false}
        loading={modalActionLoading}
        onConfirm={handleModalConfirm}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  switcherSection: {
    marginBottom: Spacing.two,
    gap: Spacing.one,
  },
  switcherHeader: {
    fontSize: 13,
    fontWeight: '600',
    opacity: 0.7,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  switcherRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    paddingVertical: Spacing.one,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    opacity: 0.8,
    marginBottom: Spacing.one,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  avatarGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  buttonGroup: {
    gap: Spacing.two,
  },
  skeletonBox: {
    gap: Spacing.two,
    paddingVertical: Spacing.one,
  },
  tabRow: {
    flexDirection: 'row',
    gap: Spacing.one,
    flexWrap: 'wrap',
    marginBottom: Spacing.two,
  },
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  cardDetailText: {
    fontSize: 13,
    opacity: 0.7,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
});
