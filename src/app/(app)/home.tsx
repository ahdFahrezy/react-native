import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Pressable,
  Platform,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AppAvatar } from '@/components/ui/app-avatar';
import { AppBadge } from '@/components/ui/app-badge';
import { AppButton } from '@/components/ui/app-button';
import { AppCard } from '@/components/ui/app-card';
import { AppDivider } from '@/components/ui/app-divider';
import { AppModal } from '@/components/ui/app-modal';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { USE_DUMMY_API } from '@/dummy';
import { useAdmissions } from '@/hooks/use-admissions';
import { useArticles } from '@/hooks/use-articles';
import { useAuth } from '@/hooks/use-auth';
import { useHealth } from '@/hooks/use-health';
import { useTheme } from '@/hooks/use-theme';

export default function DashboardScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { user, login, logout } = useAuth();
  const { result: healthResult, loading: healthLoading, refetch: refetchHealth } = useHealth();
  const { data: applicants, verifyApplicant, refetch: refetchApplicants } = useAdmissions();
  const { data: articles, refetch: refetchArticles } = useArticles();

  // Re-sync all dummy datasets on screen focus
  useFocusEffect(
    useCallback(() => {
      refetchApplicants();
      refetchArticles();
    }, [refetchApplicants, refetchArticles])
  );

  const [selectedApplicant, setSelectedApplicant] = useState<any | null>(null);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState<{ title: string; message: string } | null>(null);
  const [signingOut, setSigningOut] = useState(false);

  // Dynamic KPI counts reacting to dummy storage
  const totalApplicantsCount = 1248 + Math.max(0, applicants.length - 4);
  const pendingCount = applicants.filter((a) => a.status === 'pending').length;
  const publishedArticlesCount = articles.filter((a) => a.status !== 'draft').length;
  const draftArticlesCount = articles.filter((a) => a.status === 'draft').length;

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleVerify = async (applicantId: string, name: string) => {
    setVerifyingId(applicantId);
    try {
      await verifyApplicant({ applicantId, status: 'verified' });
      showToast(`Documents for ${name} verified successfully!`);
      if (selectedApplicant?.id === applicantId) {
        setSelectedApplicant(null);
      }
    } catch {
      showToast(`Verification failed for ${name}.`);
    } finally {
      setVerifyingId(null);
    }
  };

  const handleRequestRevision = async (applicantId: string, name: string) => {
    setVerifyingId(applicantId);
    try {
      await verifyApplicant({
        applicantId,
        status: 'revision_needed',
        note: 'Document re-upload requested by administration.',
      });
      showToast(`Revision request sent to ${name}.`);
      if (selectedApplicant?.id === applicantId) {
        setSelectedApplicant(null);
      }
    } catch {
      showToast(`Action failed for ${name}.`);
    } finally {
      setVerifyingId(null);
    }
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await logout();
      setShowSignOutModal(false);
      router.replace('/');
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 1. School CMS Top Header */}
          <View style={styles.topHeader}>
            <View style={styles.brandingWrapper}>
              <View style={styles.crestCircle}>
                <ThemedText style={styles.crestText}>🎓</ThemedText>
              </View>
              <View style={styles.brandTitleCol}>
                <ThemedText style={styles.portalTag}>EduCMS Portal</ThemedText>
                <ThemedText style={styles.schoolName}>
                  Bintang Bangsa High School
                </ThemedText>
              </View>
            </View>

            <View style={styles.topHeaderActions}>
              <ThemeToggle />

              <Pressable
                onPress={async () => {
                  await login({ email: 'student@example.com', password: 'password123' });
                  router.replace('/admissions');
                }}
                style={({ pressed }) => [
                  styles.roleSwitchBtn,
                  pressed && { opacity: 0.7 },
                ]}
              >
                <ThemedText style={styles.roleSwitchBtnText}>
                  🎓 Student Form ➔
                </ThemedText>
              </Pressable>

              <Pressable
                onPress={() => showToast('You have 4 unread administrative notices.')}
                style={({ pressed }) => [
                  styles.iconButton,
                  { backgroundColor: theme.backgroundElement },
                  pressed && styles.pressed,
                ]}
              >
                <ThemedText style={styles.bellIcon}>🔔</ThemedText>
                <View style={styles.bellBadge}>
                  <ThemedText style={styles.bellBadgeText}>4</ThemedText>
                </View>
              </Pressable>

              <Pressable
                onPress={() => setShowSignOutModal(true)}
                style={({ pressed }) => [
                  styles.profileButton,
                  pressed && styles.pressed,
                ]}
              >
                <AppAvatar
                  name={user?.name || 'Nurul Hidayah'}
                  size="sm"
                  status="online"
                />
              </Pressable>
            </View>
          </View>

          {/* 2. Welcome Hero Banner (Stitch Academic Clarity Hero) */}
          <View style={styles.heroBanner}>
            {/* Ambient Glow */}
            <View style={styles.ambientGlow} pointerEvents="none" />

            <View style={styles.heroContentRow}>
              <View style={styles.heroLeftCol}>
                <View style={styles.termBadgeRow}>
                  <View style={styles.schoolIconCircle}>
                    <ThemedText style={styles.schoolIcon}>🏫</ThemedText>
                  </View>
                  <ThemedText style={styles.termBadgeText}>
                    Academic Year 2025/2026
                  </ThemedText>
                </View>

                <ThemedText style={styles.heroGreeting}>Welcome back,</ThemedText>
                <ThemedText style={styles.heroName}>
                  {user?.name || 'Ibu Nurul Hidayah, S.Pd'}
                </ThemedText>

                <View style={styles.statusRow}>
                  <View style={styles.activePulseDot} />
                  <ThemedText style={styles.heroRoleText}>
                    {user?.role === 'admin' ? 'CMS Administrator • Active' : 'Staff Educator • Active'}
                  </ThemedText>
                </View>
              </View>

              <View style={styles.headshotContainer}>
                <Image
                  source={{
                    uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoy_xDmHlyKbdPeEO0UpyPHEL-BluzALabNOcFXT9RdYNz9PJZ0X7IVEi_mfebPZweQSibfgBZqf4dhLU3kWmwz-YiOKopBlU9Q8AxjmEp1zqhVXfvIOlaQoC0RNVl3o1qD6ia5rUJ2mE0FKDzwp9wLfx3KR5KnacXvAvp3MKkdtAAOr9wleBXgTEUKNYsPKWnfsTUyX5P4oIKeKxBlOwCqeNcZJRx1HDhQ1zdwxmxOsPNApUypFcU',
                  }}
                  style={styles.adminHeadshot}
                />
                <View style={styles.headshotCounter}>
                  <ThemedText style={styles.counterText}>4</ThemedText>
                </View>
              </View>
            </View>
          </View>

          {/* Mock API Mode Indicator */}
          <View
            style={[
              styles.mockBanner,
              {
                backgroundColor: USE_DUMMY_API ? '#0D948815' : '#0F172A15',
                borderColor: USE_DUMMY_API ? '#0D9488' : '#0F172A',
              },
            ]}
          >
            <View
              style={[
                styles.mockDot,
                { backgroundColor: USE_DUMMY_API ? '#0D9488' : '#3B82F6' },
              ]}
            />
            <ThemedText style={styles.mockText}>
              {USE_DUMMY_API
                ? 'Academic Clarity Mock Engine Active (Zero Network Errors)'
                : 'Connected to Remote Production API'}
            </ThemedText>
            <AppBadge
              label={USE_DUMMY_API ? 'DUMMY' : 'LIVE'}
              variant={USE_DUMMY_API ? 'success' : 'primary'}
              size="sm"
            />
          </View>

          {/* 3. Quick Action Buttons (Horizontal Carousel) */}
          <View style={styles.sectionTitleRow}>
            <View style={styles.sectionHeadingGroup}>
              <ThemedText style={styles.sectionIcon}>⚡</ThemedText>
              <ThemedText type="subtitle" style={styles.sectionHeading}>
                Quick Actions
              </ThemedText>
            </View>
            <ThemedText style={styles.sectionSublabel}>Primary Shortcuts</ThemedText>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.actionCarousel}
          >
            {/* Action 1: PPDB Admissions Form */}
            <Pressable
              onPress={() => router.push('/admissions')}
              style={({ pressed }) => [
                styles.quickActionChip,
                { backgroundColor: theme.backgroundElement, borderColor: '#0D9488' },
                pressed && styles.pressed,
              ]}
            >
              <View style={[styles.actionIconBox, { backgroundColor: 'rgba(13, 148, 136, 0.15)' }]}>
                <ThemedText style={styles.chipEmoji}>🎓</ThemedText>
              </View>
              <ThemedText style={[styles.actionChipText, { color: '#0D9488', fontWeight: '700' }]}>
                PPDB Form
              </ThemedText>
            </Pressable>

            {/* Action 2: Verify Documents (Highlighted Emerald) */}
            <Pressable
              onPress={() => showToast('Showing pending student verifications below')}
              style={({ pressed }) => [
                styles.quickActionChip,
                styles.highlightChip,
                pressed && styles.pressed,
              ]}
            >
              <View style={[styles.actionIconBox, { backgroundColor: '#004D40' }]}>
                <ThemedText style={styles.chipEmoji}>📋</ThemedText>
              </View>
              <ThemedText style={styles.highlightChipText}>
                Verify Documents
              </ThemedText>
            </Pressable>

            {/* Action 3: Write Article */}
            <Pressable
              onPress={() => router.push('/explore')}
              style={({ pressed }) => [
                styles.quickActionChip,
                { backgroundColor: theme.backgroundElement, borderColor: theme.border },
                pressed && styles.pressed,
              ]}
            >
              <View style={[styles.actionIconBox, { backgroundColor: '#F1F5F9' }]}>
                <ThemedText style={styles.chipEmoji}>📝</ThemedText>
              </View>
              <ThemedText style={styles.actionChipText}>Write Article</ThemedText>
            </Pressable>

            {/* Action 4: UI Catalog */}
            <Pressable
              onPress={() => router.push('/template-demo')}
              style={({ pressed }) => [
                styles.quickActionChip,
                { backgroundColor: theme.backgroundElement, borderColor: theme.border },
                pressed && styles.pressed,
              ]}
            >
              <View style={[styles.actionIconBox, { backgroundColor: '#F1F5F9' }]}>
                <ThemedText style={styles.chipEmoji}>🎨</ThemedText>
              </View>
              <ThemedText style={styles.actionChipText}>UI Catalog</ThemedText>
            </Pressable>

            {/* Action 5: Make Module */}
            <Pressable
              onPress={() =>
                setShowActionModal({
                  title: 'Module Scaffolding Generator',
                  message:
                    'To scaffold a new module following the Single-Action Service & Dummy API pattern, run:\n\nnpm run make:module <name>\n\nExample: npm run make:module student',
                })
              }
              style={({ pressed }) => [
                styles.quickActionChip,
                { backgroundColor: theme.backgroundElement, borderColor: theme.border },
                pressed && styles.pressed,
              ]}
            >
              <View style={[styles.actionIconBox, { backgroundColor: '#F1F5F9' }]}>
                <ThemedText style={styles.chipEmoji}>⚙️</ThemedText>
              </View>
              <ThemedText style={styles.actionChipText}>Make Module</ThemedText>
            </Pressable>
          </ScrollView>

          {/* 4. Metric KPI Cards (Stitch 2x2 Grid) */}
          <View style={styles.sectionTitleRow}>
            <View style={styles.sectionHeadingGroup}>
              <ThemedText style={styles.sectionIcon}>📊</ThemedText>
              <ThemedText type="subtitle" style={styles.sectionHeading}>
                Key Metrics
              </ThemedText>
            </View>
            <ThemedText style={styles.liveSyncText}>• Auto Sync</ThemedText>
          </View>

          <View style={styles.kpiGrid}>
            {/* KPI 1: Total Applicants */}
            <View
              style={[
                styles.kpiCard,
                { backgroundColor: theme.backgroundElement, borderColor: theme.border },
              ]}
            >
              <View style={styles.kpiTopRow}>
                <View style={styles.kpiIconSquare}>
                  <ThemedText style={styles.kpiSymbol}>👨‍🎓</ThemedText>
                </View>
                <AppBadge label="+18%" variant="success" size="sm" />
              </View>
              <View style={styles.kpiDataCol}>
                <ThemedText style={styles.kpiLabel}>TOTAL APPLICANTS</ThemedText>
                <ThemedText style={styles.kpiBigNumber}>{totalApplicantsCount.toLocaleString()}</ThemedText>
                <ThemedText style={styles.kpiSub}>+{applicants.length} registered</ThemedText>
              </View>
            </View>

            {/* KPI 2: Pending Verification */}
            <View
              style={[
                styles.kpiCard,
                { backgroundColor: theme.backgroundElement, borderColor: theme.border },
              ]}
            >
              <View style={styles.kpiTopRow}>
                <View style={[styles.kpiIconSquare, { backgroundColor: '#FEF3C7' }]}>
                  <ThemedText style={styles.kpiSymbol}>⏳</ThemedText>
                </View>
                <AppBadge label="Action" variant="warning" size="sm" dot />
              </View>
              <View style={styles.kpiDataCol}>
                <ThemedText style={styles.kpiLabel}>VERIFY DOCUMENTS</ThemedText>
                <ThemedText style={[styles.kpiBigNumber, { color: '#D97706' }]}>
                  {pendingCount}
                </ThemedText>
                <ThemedText style={styles.kpiSub}>
                  {pendingCount > 0 ? 'Requires action today' : 'All caught up'}
                </ThemedText>
              </View>
            </View>

            {/* KPI 3: Published Articles */}
            <View
              style={[
                styles.kpiCard,
                { backgroundColor: theme.backgroundElement, borderColor: theme.border },
              ]}
            >
              <View style={styles.kpiTopRow}>
                <View style={styles.kpiIconSquare}>
                  <ThemedText style={styles.kpiSymbol}>📰</ThemedText>
                </View>
                <AppBadge label="Active" variant="primary" size="sm" />
              </View>
              <View style={styles.kpiDataCol}>
                <ThemedText style={styles.kpiLabel}>PUBLIC ARTICLES</ThemedText>
                <ThemedText style={styles.kpiBigNumber}>{publishedArticlesCount}</ThemedText>
                <ThemedText style={styles.kpiSub}>{draftArticlesCount} drafts unpublished</ThemedText>
              </View>
            </View>

            {/* KPI 4: Web Visits */}
            <View
              style={[
                styles.kpiCard,
                { backgroundColor: theme.backgroundElement, borderColor: theme.border },
              ]}
            >
              <View style={styles.kpiTopRow}>
                <View style={styles.kpiIconSquare}>
                  <ThemedText style={styles.kpiSymbol}>👁️</ThemedText>
                </View>
                <ThemedText style={styles.kpiTagMonth}>This Month</ThemedText>
              </View>
              <View style={styles.kpiDataCol}>
                <ThemedText style={styles.kpiLabel}>PORTAL VISITS</ThemedText>
                <ThemedText style={styles.kpiBigNumber}>15.4K</ThemedText>
                <ThemedText style={styles.kpiSub}>Bounce rate 24%</ThemedText>
              </View>
            </View>
          </View>

          {/* 5. Student Document Verification Stack (Stitch Screen Port) */}
          <View style={styles.sectionTitleRow}>
            <View style={styles.sectionHeadingGroup}>
              <ThemedText style={styles.sectionIcon}>🛡️</ThemedText>
              <View>
                <ThemedText type="subtitle" style={styles.sectionHeading}>
                  Student Document Verification
                </ThemedText>
                <ThemedText style={styles.sectionSublabel}>
                  Recent admissions requiring administrative action
                </ThemedText>
              </View>
            </View>
            <Pressable onPress={() => showToast('All 42 records loaded')}>
              <ThemedText style={styles.viewAllLink}>View All ➔</ThemedText>
            </Pressable>
          </View>

          <View style={styles.applicantStack}>
            {applicants.map((applicant) => {
              const isVerifying = verifyingId === applicant.id;
              const isVerified = applicant.status === 'verified';
              const isRevision = applicant.status === 'revision_needed';

              return (
                <View
                  key={applicant.id}
                  style={[
                    styles.applicantCard,
                    { backgroundColor: theme.backgroundElement, borderColor: theme.border },
                  ]}
                >
                  {/* Top: Avatar, Name, Status Badge */}
                  <View style={styles.applicantHeader}>
                    <View style={styles.applicantProfileGroup}>
                      <Image
                        source={{ uri: applicant.avatarUrl }}
                        style={styles.applicantAvatar}
                      />
                      <View style={styles.applicantNameCol}>
                        <ThemedText style={styles.applicantName}>
                          {applicant.name}
                        </ThemedText>
                        <ThemedText style={styles.applicantNisn}>
                          NISN: {applicant.nisn}
                        </ThemedText>
                      </View>
                    </View>

                    <AppBadge
                      label={applicant.statusLabel}
                      variant={
                        isVerified ? 'success' : isRevision ? 'error' : 'warning'
                      }
                      size="sm"
                      dot
                    />
                  </View>

                  {/* Middle: 3-column academic matrix */}
                  <View
                    style={[
                      styles.academicMatrix,
                      { backgroundColor: theme.background },
                    ]}
                  >
                    <View style={styles.matrixCol}>
                      <ThemedText style={styles.matrixLabel}>Track</ThemedText>
                      <ThemedText style={styles.matrixValue} numberOfLines={1}>
                        {applicant.admissionTrack}
                      </ThemedText>
                    </View>
                    <View style={styles.matrixCol}>
                      <ThemedText style={styles.matrixLabel}>Avg Score</ThemedText>
                      <ThemedText style={[styles.matrixValue, { color: '#0D9488', fontWeight: '700' }]}>
                        {applicant.averageScore.toFixed(2)}
                      </ThemedText>
                    </View>
                    <View style={styles.matrixCol}>
                      <ThemedText style={styles.matrixLabel}>Choice</ThemedText>
                      <ThemedText style={styles.matrixValue} numberOfLines={1}>
                        {applicant.majorChoice}
                      </ThemedText>
                    </View>
                  </View>

                  {/* Bottom Actions & Attachment Indicator */}
                  <View style={styles.applicantFooter}>
                    <View style={styles.attachmentRow}>
                      <ThemedText style={styles.attachmentIcon}>📎</ThemedText>
                      <ThemedText style={styles.attachmentText}>
                        {applicant.note || `${applicant.documentCount} PDF Documents attached`}
                      </ThemedText>
                    </View>

                    <View style={styles.applicantActionButtons}>
                      <AppButton
                        title="Details"
                        variant="ghost"
                        size="sm"
                        onPress={() => setSelectedApplicant(applicant)}
                      />
                      {isVerified ? (
                        <AppBadge label="Verified ✓" variant="success" size="sm" />
                      ) : isRevision ? (
                        <AppButton
                          title="Send Notice"
                          variant="danger"
                          size="sm"
                          onPress={() =>
                            handleRequestRevision(applicant.id, applicant.name)
                          }
                        />
                      ) : (
                        <AppButton
                          title={isVerifying ? 'Verifying...' : 'Verify'}
                          variant="primary"
                          size="sm"
                          loading={isVerifying}
                          onPress={() => handleVerify(applicant.id, applicant.name)}
                        />
                      )}
                    </View>
                  </View>
                </View>
              );
            })}
          </View>

          {/* 6. Recent Platform Audit Trail (Stitch Screen Port) */}
          <AppCard
            title="Recent Activity Log"
            subtitle="Platform audit trail & event history"
            headerRight={
              <ThemedText style={styles.auditSecurityText}>
                🔒 Encrypted Audit Trail
              </ThemedText>
            }
            style={styles.fullWidth}
          >
            <View style={styles.auditStream}>
              <View style={styles.auditItem}>
                <View style={[styles.auditIconBubble, { backgroundColor: '#0D948820' }]}>
                  <ThemedText style={styles.auditEmoji}>📰</ThemedText>
                </View>
                <View style={styles.auditTextCol}>
                  <View style={styles.auditTitleRow}>
                    <ThemedText style={styles.auditTitle}>
                      New Article Published
                    </ThemedText>
                    <ThemedText style={styles.auditTime}>12m ago</ThemedText>
                  </View>
                  <ThemedText style={styles.auditDescription} numberOfLines={1}>
                    "Robotics Team Wins Gold at 2025 National Olympiad"
                  </ThemedText>
                  <ThemedText style={styles.auditAuthor}>
                    By: Nurul Hidayah, S.Pd
                  </ThemedText>
                </View>
              </View>

              <AppDivider />

              <View style={styles.auditItem}>
                <View style={[styles.auditIconBubble, { backgroundColor: '#D9770620' }]}>
                  <ThemedText style={styles.auditEmoji}>📢</ThemedText>
                </View>
                <View style={styles.auditTextCol}>
                  <View style={styles.auditTitleRow}>
                    <ThemedText style={styles.auditTitle}>
                      Announcement Updated
                    </ThemedText>
                    <ThemedText style={styles.auditTime}>1h ago</ThemedText>
                  </View>
                  <ThemedText style={styles.auditDescription} numberOfLines={1}>
                    Physical Document Verification Schedule for PPDB Academic Track
                  </ThemedText>
                  <ThemedText style={styles.auditAuthor}>
                    By: IT Support Bintang Bangsa
                  </ThemedText>
                </View>
              </View>

              <AppDivider />

              <View style={styles.auditItem}>
                <View style={[styles.auditIconBubble, { backgroundColor: '#3B82F620' }]}>
                  <ThemedText style={styles.auditEmoji}>☑️</ThemedText>
                </View>
                <View style={styles.auditTextCol}>
                  <View style={styles.auditTitleRow}>
                    <ThemedText style={styles.auditTitle}>
                      Bulk Document Verification
                    </ThemedText>
                    <ThemedText style={styles.auditTime}>3h ago</ThemedText>
                  </View>
                  <ThemedText style={styles.auditDescription} numberOfLines={1}>
                    18 student files validated for Regular Zoning Track
                  </ThemedText>
                  <ThemedText style={styles.auditAuthor}>
                    By: Admissions Committee
                  </ThemedText>
                </View>
              </View>
            </View>
          </AppCard>

          {/* 7. System Health Status Card */}
          <AppCard
            title="System & Architecture Telemetry"
            subtitle="Repository-Service-Hook architecture evaluation"
            headerRight={
              <AppBadge
                label={
                  healthLoading
                    ? 'Checking...'
                    : healthResult?.status === 'healthy'
                    ? 'Healthy'
                    : 'Optimal'
                }
                variant="success"
                size="sm"
                dot
              />
            }
            style={styles.fullWidth}
          >
            <View style={styles.telemetryRows}>
              <View style={styles.telemetryRow}>
                <ThemedText style={styles.telemetryLabel}>Theme Mode:</ThemedText>
                <ThemeToggle variant="pill" />
              </View>

              <View style={styles.telemetryRow}>
                <ThemedText style={styles.telemetryLabel}>Data Source:</ThemedText>
                <ThemedText style={styles.telemetryValue}>
                  {USE_DUMMY_API ? 'In-Memory Dummy APIs (Zero Network Overheads)' : 'Production Remote API'}
                </ThemedText>
              </View>

              <View style={styles.telemetryRow}>
                <ThemedText style={styles.telemetryLabel}>Response Time:</ThemedText>
                <ThemedText style={[styles.telemetryValue, { color: '#0D9488', fontWeight: '700' }]}>
                  {healthResult ? `${healthResult.latencyMs} ms` : '58 ms'}
                </ThemedText>
              </View>

              <AppButton
                title={healthLoading ? 'Evaluating API...' : 'Ping Health Service'}
                variant="outline"
                size="sm"
                loading={healthLoading}
                onPress={() => refetchHealth()}
                style={styles.pingHealthButton}
              />
            </View>
          </AppCard>
        </ScrollView>
      </SafeAreaView>

      {/* Interactive Toast Notification */}
      {toastMessage && (
        <View style={styles.toastContainer}>
          <ThemedText style={styles.toastIcon}>✓</ThemedText>
          <ThemedText style={styles.toastText}>{toastMessage}</ThemedText>
        </View>
      )}

      {/* Action Info Modal */}
      {showActionModal && (
        <AppModal
          visible={true}
          onClose={() => setShowActionModal(null)}
          title={showActionModal.title}
          message={showActionModal.message}
          confirmText="Dismiss"
          onConfirm={() => setShowActionModal(null)}
        />
      )}

      {/* Applicant Detail & Action Modal */}
      {selectedApplicant && (
        <AppModal
          visible={!!selectedApplicant}
          onClose={() => setSelectedApplicant(null)}
          title={`Applicant: ${selectedApplicant.name}`}
          message={`NISN: ${selectedApplicant.nisn} • ${selectedApplicant.admissionTrack}`}
          cancelText="Close"
        >
          <ScrollView style={{ maxHeight: 380 }}>
            <View style={{ gap: 8, marginVertical: 8 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <ThemedText style={{ fontSize: 12, opacity: 0.6 }}>Track & Major:</ThemedText>
                <ThemedText style={{ fontSize: 12, fontWeight: '700' }}>
                  {selectedApplicant.admissionTrack} ({selectedApplicant.majorChoice})
                </ThemedText>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <ThemedText style={{ fontSize: 12, opacity: 0.6 }}>Junior High School:</ThemedText>
                <ThemedText style={{ fontSize: 12, fontWeight: '700' }}>
                  {selectedApplicant.previousSchool || 'SMP Negeri 1 Jakarta'}
                </ThemedText>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <ThemedText style={{ fontSize: 12, opacity: 0.6 }}>Parent / Guardian:</ThemedText>
                <ThemedText style={{ fontSize: 12, fontWeight: '700' }}>
                  {selectedApplicant.parentName || 'Rahmat Hidayat'} ({selectedApplicant.parentPhone || '+62 812-3456-7890'})
                </ThemedText>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <ThemedText style={{ fontSize: 12, opacity: 0.6 }}>Address / Distance:</ThemedText>
                <ThemedText style={{ fontSize: 12, fontWeight: '700' }}>
                  {selectedApplicant.address || 'Menteng, Jakarta'} ({selectedApplicant.distanceKm ?? 1.4} Km)
                </ThemedText>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <ThemedText style={{ fontSize: 12, opacity: 0.6 }}>Verification Status:</ThemedText>
                <AppBadge
                  label={selectedApplicant.statusLabel || selectedApplicant.status}
                  variant={
                    selectedApplicant.status === 'verified'
                      ? 'success'
                      : selectedApplicant.status === 'revision_needed'
                      ? 'error'
                      : 'warning'
                  }
                  size="sm"
                  dot
                />
              </View>

              {selectedApplicant.note && (
                <View style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: 8, borderRadius: 8 }}>
                  <ThemedText style={{ fontSize: 12, color: '#EF4444' }}>
                    Note: {selectedApplicant.note}
                  </ThemedText>
                </View>
              )}
            </View>

            <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
              <AppButton
                title="Request Revision"
                variant="outline"
                size="sm"
                loading={verifyingId === selectedApplicant.id}
                onPress={() => handleRequestRevision(selectedApplicant.id, selectedApplicant.name)}
                style={{ flex: 1 }}
              />
              <AppButton
                title="Verify & Approve"
                variant="primary"
                size="sm"
                loading={verifyingId === selectedApplicant.id}
                onPress={() => handleVerify(selectedApplicant.id, selectedApplicant.name)}
                style={{ flex: 1 }}
              />
            </View>
          </ScrollView>
        </AppModal>
      )}

      {/* Sign Out Modal */}
      <AppModal
        visible={showSignOutModal}
        onClose={() => setShowSignOutModal(false)}
        title="Sign Out"
        message="Are you sure you want to exit the EduCMS administrative session?"
        confirmText={signingOut ? 'Signing out...' : 'Sign Out'}
        cancelText="Cancel"
        destructive={true}
        onConfirm={handleSignOut}
      />
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
    maxWidth: MaxContentWidth,
    width: '100%',
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.five,
    gap: Spacing.four,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.one,
  },
  brandingWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    flex: 1,
  },
  crestCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  crestText: {
    fontSize: 20,
  },
  brandTitleCol: {
    flex: 1,
    gap: 1,
  },
  portalTag: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0D9488',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  schoolName: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  topHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  roleSwitchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.two,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#0D9488',
  },
  roleSwitchBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2DD4BF',
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bellIcon: {
    fontSize: 18,
  },
  bellBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#0D9488',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  profileButton: {
    borderRadius: 20,
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.97 }],
  },
  heroBanner: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: Spacing.four,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  ambientGlow: {
    position: 'absolute',
    right: -20,
    bottom: -20,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#0D9488',
    opacity: 0.25,
  },
  heroContentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.three,
  },
  heroLeftCol: {
    flex: 1,
    gap: 4,
  },
  termBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  schoolIconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#0D9488',
    alignItems: 'center',
    justifyContent: 'center',
  },
  schoolIcon: {
    fontSize: 12,
  },
  termBadgeText: {
    color: '#86F2E4',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heroGreeting: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '500',
  },
  heroName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  activePulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  heroRoleText: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '500',
  },
  headshotContainer: {
    position: 'relative',
  },
  adminHeadshot: {
    width: 62,
    height: 62,
    borderRadius: 14,
    backgroundColor: '#1E293B',
  },
  headshotCounter: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#0D9488',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#0F172A',
  },
  counterText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  mockBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: Spacing.three,
    borderRadius: 10,
    borderWidth: 1,
  },
  mockDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  mockText: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.one,
  },
  sectionHeadingGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  sectionIcon: {
    fontSize: 18,
  },
  sectionHeading: {
    fontSize: 17,
    fontWeight: '700',
  },
  sectionSublabel: {
    fontSize: 12,
    opacity: 0.6,
  },
  liveSyncText: {
    fontSize: 12,
    color: '#0D9488',
    fontWeight: '700',
  },
  viewAllLink: {
    fontSize: 12,
    color: '#0D9488',
    fontWeight: '700',
  },
  actionCarousel: {
    gap: Spacing.two,
    paddingVertical: 4,
  },
  quickActionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: 10,
    paddingHorizontal: Spacing.three,
    borderRadius: 12,
    borderWidth: 1,
  },
  highlightChip: {
    backgroundColor: '#0D9488',
    borderColor: '#0D9488',
  },
  actionIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipEmoji: {
    fontSize: 16,
  },
  actionChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  highlightChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
  },
  kpiCard: {
    flex: 1,
    minWidth: 150,
    padding: Spacing.three,
    borderRadius: 14,
    borderWidth: 1,
    gap: Spacing.two,
  },
  kpiTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  kpiIconSquare: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kpiSymbol: {
    fontSize: 18,
  },
  kpiTagMonth: {
    fontSize: 11,
    color: '#0D9488',
    fontWeight: '700',
  },
  kpiDataCol: {
    gap: 2,
  },
  kpiLabel: {
    fontSize: 11,
    letterSpacing: 0.6,
    opacity: 0.6,
    fontWeight: '600',
  },
  kpiBigNumber: {
    fontSize: 24,
    fontWeight: '800',
  },
  kpiSub: {
    fontSize: 11,
    opacity: 0.55,
  },
  applicantStack: {
    gap: Spacing.three,
  },
  applicantCard: {
    padding: Spacing.three,
    borderRadius: 14,
    borderWidth: 1,
    gap: Spacing.two,
  },
  applicantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.two,
  },
  applicantProfileGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    flex: 1,
  },
  applicantAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E2E8F0',
  },
  applicantNameCol: {
    flex: 1,
    gap: 2,
  },
  applicantName: {
    fontSize: 14,
    fontWeight: '700',
  },
  applicantNisn: {
    fontSize: 11,
    opacity: 0.6,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  academicMatrix: {
    flexDirection: 'row',
    padding: Spacing.two,
    borderRadius: 8,
    gap: Spacing.one,
  },
  matrixCol: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  matrixLabel: {
    fontSize: 10,
    opacity: 0.6,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  matrixValue: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  applicantFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.two,
    flexWrap: 'wrap',
    paddingTop: 4,
  },
  attachmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    minWidth: 140,
  },
  attachmentIcon: {
    fontSize: 13,
  },
  attachmentText: {
    fontSize: 11,
    opacity: 0.6,
  },
  applicantActionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  auditSecurityText: {
    fontSize: 11,
    color: '#0D9488',
    fontWeight: '600',
  },
  auditStream: {
    gap: Spacing.two,
  },
  auditItem: {
    flexDirection: 'row',
    gap: Spacing.two,
    alignItems: 'flex-start',
  },
  auditIconBubble: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  auditEmoji: {
    fontSize: 16,
  },
  auditTextCol: {
    flex: 1,
    gap: 2,
  },
  auditTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  auditTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  auditTime: {
    fontSize: 11,
    opacity: 0.5,
  },
  auditDescription: {
    fontSize: 12,
    opacity: 0.7,
  },
  auditAuthor: {
    fontSize: 11,
    color: '#0D9488',
    fontWeight: '500',
  },
  telemetryRows: {
    gap: Spacing.two,
  },
  telemetryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  telemetryLabel: {
    fontSize: 13,
    opacity: 0.7,
  },
  telemetryValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  pingHealthButton: {
    marginTop: Spacing.two,
    alignSelf: 'stretch',
  },
  toastContainer: {
    position: 'absolute',
    bottom: 90,
    alignSelf: 'center',
    backgroundColor: '#0F172A',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 9999,
  },
  toastIcon: {
    color: '#86F2E4',
    fontSize: 14,
    fontWeight: '800',
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
