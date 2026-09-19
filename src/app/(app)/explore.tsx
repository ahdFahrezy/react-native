import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Pressable,
  Image,
  TextInput,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AppAvatar } from '@/components/ui/app-avatar';
import { AppBadge } from '@/components/ui/app-badge';
import { AppButton } from '@/components/ui/app-button';
import { AppCard } from '@/components/ui/app-card';
import { AppModal } from '@/components/ui/app-modal';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useArticles } from '@/hooks/use-articles';
import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/hooks/use-auth';
import { Article, ArticleCategory } from '@/types/article.types';

const CATEGORIES: ArticleCategory[] = [
  'All',
  'Achievements',
  'Announcements',
  'School News',
  'Student Life',
];

export default function ExploreArticlesScreen() {
  const theme = useTheme();
  const { user } = useAuth();
  const {
    data: articles,
    loading,
    refetch,
    publishArticle,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
  } = useArticles();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newExcerpt, setNewExcerpt] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newAuthor, setNewAuthor] = useState(user?.name || 'Nurul Hidayah, S.Pd');
  const [newCategory, setNewCategory] = useState<ArticleCategory>('School News');
  const [publishing, setPublishing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Automatically refresh articles when screen is focused
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleSaveArticle = async (asDraft = false) => {
    if (!newTitle.trim()) {
      showToast('Please enter an article title.');
      return;
    }
    if (!newContent.trim()) {
      showToast('Please provide article content.');
      return;
    }

    setPublishing(true);
    try {
      await publishArticle({
        title: newTitle.trim(),
        excerpt: newExcerpt.trim() || newContent.slice(0, 95) + '...',
        content: newContent.trim(),
        category: newCategory,
        author: newAuthor.trim() || user?.name || 'Nurul Hidayah, S.Pd',
        status: asDraft ? 'draft' : 'published',
        featuredImageUrl:
          newCategory === 'Achievements'
            ? 'https://images.unsplash.com/photo-1567168544813-cc03465b4fa8?w=600'
            : newCategory === 'Announcements'
            ? 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600'
            : 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600',
      });
      setShowCreateModal(false);
      setNewTitle('');
      setNewExcerpt('');
      setNewContent('');
      showToast(asDraft ? '💾 Article draft saved to dummy storage!' : '🚀 Article published successfully!');
    } catch {
      showToast('Failed to save article.');
    } finally {
      setPublishing(false);
    }
  };

  const featuredArticle = articles[0];
  const regularArticles = articles.slice(1);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeftCol}>
              <ThemedText style={styles.subTag}>EduCMS Publishing</ThemedText>
              <ThemedText type="subtitle" style={styles.mainTitle}>
                Articles & Content
              </ThemedText>
              <ThemedText style={styles.headerSubtitle}>
                Official news, announcements & school publications
              </ThemedText>
            </View>

            <AppButton
              title="+ Write"
              variant="primary"
              size="sm"
              onPress={() => setShowCreateModal(true)}
            />
          </View>

          {/* Search Bar */}
          <View
            style={[
              styles.searchBarContainer,
              { backgroundColor: theme.backgroundElement, borderColor: theme.border },
            ]}
          >
            <ThemedText style={styles.searchIcon}>🔍</ThemedText>
            <TextInput
              style={[styles.searchInput, { color: theme.text }]}
              placeholder="Search news, topics, or authors..."
              placeholderTextColor={theme.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              clearButtonMode="while-editing"
            />
          </View>

          {/* Category Filter Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryChipsRow}
          >
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <Pressable
                  key={cat}
                  onPress={() => setSelectedCategory(cat)}
                  style={({ pressed }) => [
                    styles.filterChip,
                    {
                      backgroundColor: isSelected ? '#0F172A' : theme.backgroundElement,
                      borderColor: isSelected ? '#0F172A' : theme.border,
                    },
                    pressed && styles.pressed,
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.filterChipText,
                      { color: isSelected ? '#FFFFFF' : theme.text },
                    ]}
                  >
                    {cat}
                  </ThemedText>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Featured Article Card */}
          {featuredArticle && (
            <View style={styles.featuredSection}>
              <ThemedText style={styles.sectionHeading}>FEATURED STORY</ThemedText>
              <Pressable
                onPress={() => setSelectedArticle(featuredArticle)}
                style={({ pressed }) => [
                  styles.featuredCard,
                  { backgroundColor: theme.backgroundElement, borderColor: theme.border },
                  pressed && styles.pressed,
                ]}
              >
                {featuredArticle.featuredImageUrl && (
                  <Image
                    source={{ uri: featuredArticle.featuredImageUrl }}
                    style={styles.featuredImage}
                  />
                )}
                <View style={styles.featuredBody}>
                  <View style={styles.featuredBadgeRow}>
                    <AppBadge
                      label={featuredArticle.category}
                      variant="primary"
                      size="sm"
                    />
                    <ThemedText style={styles.readingTimeText}>
                      {featuredArticle.readingTimeMinutes} min read
                    </ThemedText>
                  </View>

                  <ThemedText style={styles.featuredTitle}>
                    {featuredArticle.title}
                  </ThemedText>
                  <ThemedText style={styles.featuredExcerpt} numberOfLines={2}>
                    {featuredArticle.excerpt}
                  </ThemedText>

                  <View style={styles.authorRow}>
                    <AppAvatar name={featuredArticle.author} size="sm" />
                    <View style={styles.authorInfoCol}>
                      <ThemedText style={styles.authorName}>
                        {featuredArticle.author}
                      </ThemedText>
                      <ThemedText style={styles.publishDate}>
                        {featuredArticle.publishedAt}
                      </ThemedText>
                    </View>
                    {featuredArticle.status === 'draft' && (
                      <AppBadge label="Draft" variant="warning" size="sm" dot style={{ marginLeft: 'auto' }} />
                    )}
                  </View>
                </View>
              </Pressable>
            </View>
          )}

          {/* Regular Articles Feed */}
          <View style={styles.articlesFeedSection}>
            <ThemedText style={styles.sectionHeading}>
              ALL PUBLICATIONS ({articles.length})
            </ThemedText>

            {regularArticles.map((article) => (
              <Pressable
                key={article.id}
                onPress={() => setSelectedArticle(article)}
                style={({ pressed }) => [
                  styles.articleFeedCard,
                  { backgroundColor: theme.backgroundElement, borderColor: theme.border },
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.articleCardBody}>
                  <View style={styles.articleMetaTop}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <AppBadge label={article.category} variant="info" size="sm" />
                      {article.status === 'draft' && (
                        <AppBadge label="Draft" variant="warning" size="sm" dot />
                      )}
                    </View>
                    <ThemedText style={styles.articleTime}>
                      {article.publishedAt}
                    </ThemedText>
                  </View>

                  <ThemedText style={styles.articleTitle}>
                    {article.title}
                  </ThemedText>
                  <ThemedText style={styles.articleExcerpt} numberOfLines={2}>
                    {article.excerpt}
                  </ThemedText>

                  <View style={styles.articleFooter}>
                    <ThemedText style={styles.articleAuthor}>
                      By {article.author}
                    </ThemedText>
                    <ThemedText style={styles.articleMinutes}>
                      {article.readingTimeMinutes} min read
                    </ThemedText>
                  </View>
                </View>

                {article.featuredImageUrl && (
                  <Image
                    source={{ uri: article.featuredImageUrl }}
                    style={styles.thumbnailImage}
                  />
                )}
              </Pressable>
            ))}

            {articles.length === 0 && !loading && (
              <View style={styles.emptyContainer}>
                <ThemedText style={styles.emptyEmoji}>📰</ThemedText>
                <ThemedText style={styles.emptyTitle}>No Articles Found</ThemedText>
                <ThemedText style={styles.emptySub}>
                  Try clearing your search query or pick a different category.
                </ThemedText>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Toast Notification */}
      {toastMessage && (
        <View style={styles.toastContainer}>
          <ThemedText style={styles.toastIcon}>✓</ThemedText>
          <ThemedText style={styles.toastText}>{toastMessage}</ThemedText>
        </View>
      )}

      {/* Create / Save Article Modal */}
      <AppModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create School Article"
        message="Publish an official announcement or save as draft in the dummy store."
        cancelText="Cancel"
      >
        <View style={styles.formContainer}>
          {/* Category Selector */}
          <ThemedText style={styles.inputLabel}>Category</ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 4 }}>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              {(['School News', 'Achievements', 'Announcements', 'Student Life'] as ArticleCategory[]).map((cat) => (
                <Pressable
                  key={cat}
                  onPress={() => setNewCategory(cat)}
                  style={[
                    styles.catChip,
                    newCategory === cat && styles.catChipActive,
                    { borderColor: newCategory === cat ? '#0D9488' : theme.border },
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.catChipText,
                      newCategory === cat && styles.catChipTextActive,
                    ]}
                  >
                    {cat}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          </ScrollView>

          <ThemedText style={styles.inputLabel}>Title</ThemedText>
          <TextInput
            style={[styles.modalInput, { color: theme.text, borderColor: theme.border }]}
            placeholder="e.g. National Championship Winners"
            placeholderTextColor={theme.textSecondary}
            value={newTitle}
            onChangeText={setNewTitle}
          />

          <ThemedText style={styles.inputLabel}>Author</ThemedText>
          <TextInput
            style={[styles.modalInput, { color: theme.text, borderColor: theme.border }]}
            placeholder="Author / Department"
            placeholderTextColor={theme.textSecondary}
            value={newAuthor}
            onChangeText={setNewAuthor}
          />

          <ThemedText style={styles.inputLabel}>Excerpt / Short Summary</ThemedText>
          <TextInput
            style={[styles.modalInput, { color: theme.text, borderColor: theme.border }]}
            placeholder="Brief overview of the article..."
            placeholderTextColor={theme.textSecondary}
            value={newExcerpt}
            onChangeText={setNewExcerpt}
          />

          <ThemedText style={styles.inputLabel}>Full Content</ThemedText>
          <TextInput
            style={[
              styles.modalInput,
              styles.modalTextArea,
              { color: theme.text, borderColor: theme.border },
            ]}
            placeholder="Write full article body text..."
            placeholderTextColor={theme.textSecondary}
            value={newContent}
            onChangeText={setNewContent}
            multiline
            numberOfLines={4}
          />

          {/* Action Buttons: Save Draft & Publish Now */}
          <View style={styles.modalActionButtonsRow}>
            <AppButton
              title="💾 Save Draft"
              variant="outline"
              size="sm"
              loading={publishing}
              onPress={() => handleSaveArticle(true)}
              style={{ flex: 1 }}
            />
            <AppButton
              title="🚀 Publish Now"
              variant="primary"
              size="sm"
              loading={publishing}
              onPress={() => handleSaveArticle(false)}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </AppModal>

      {/* Article Detail Reader Modal */}
      {selectedArticle && (
        <AppModal
          visible={!!selectedArticle}
          onClose={() => setSelectedArticle(null)}
          title={selectedArticle.title}
          confirmText="Done"
          onConfirm={() => setSelectedArticle(null)}
        >
          <ScrollView style={{ maxHeight: 420 }}>
            {selectedArticle.featuredImageUrl && (
              <Image
                source={{ uri: selectedArticle.featuredImageUrl }}
                style={styles.readerHeroImage}
                resizeMode="cover"
              />
            )}
            <View style={styles.readerMetaRow}>
              <AppBadge label={selectedArticle.category} variant="info" size="sm" />
              <ThemedText style={styles.readerTimeText}>
                {selectedArticle.readingTimeMinutes} min read • {selectedArticle.publishedAt}
              </ThemedText>
            </View>

            <View style={styles.readerAuthorRow}>
              <AppAvatar name={selectedArticle.author} size="sm" />
              <View>
                <ThemedText style={{ fontSize: 13, fontWeight: '700' }}>
                  {selectedArticle.author}
                </ThemedText>
                <ThemedText style={{ fontSize: 11, opacity: 0.6 }}>
                  Status: {selectedArticle.status === 'draft' ? 'Draft' : 'Published'}
                </ThemedText>
              </View>
            </View>

            <ThemedText style={styles.readerBodyContent}>
              {selectedArticle.content}
            </ThemedText>
          </ScrollView>
        </AppModal>
      )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.one,
  },
  headerLeftCol: {
    flex: 1,
    gap: 2,
  },
  subTag: {
    fontSize: 11,
    color: '#0D9488',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  headerSubtitle: {
    fontSize: 12,
    opacity: 0.6,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: Spacing.two,
  },
  searchIcon: {
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
  categoryChipsRow: {
    gap: Spacing.two,
    paddingVertical: 2,
  },
  filterChip: {
    paddingVertical: 8,
    paddingHorizontal: Spacing.three,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.75,
  },
  featuredSection: {
    gap: Spacing.two,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '700',
    opacity: 0.6,
    letterSpacing: 0.7,
  },
  featuredCard: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  featuredImage: {
    width: '100%',
    height: 170,
    backgroundColor: '#0F172A',
  },
  featuredBody: {
    padding: Spacing.three,
    gap: Spacing.two,
  },
  featuredBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  readingTimeText: {
    fontSize: 11,
    opacity: 0.6,
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  featuredExcerpt: {
    fontSize: 13,
    opacity: 0.7,
    lineHeight: 18,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginTop: 4,
  },
  authorInfoCol: {
    gap: 1,
  },
  authorName: {
    fontSize: 12,
    fontWeight: '600',
  },
  publishDate: {
    fontSize: 11,
    opacity: 0.5,
  },
  articlesFeedSection: {
    gap: Spacing.three,
  },
  articleFeedCard: {
    flexDirection: 'row',
    padding: Spacing.three,
    borderRadius: 14,
    borderWidth: 1,
    gap: Spacing.three,
    alignItems: 'center',
  },
  articleCardBody: {
    flex: 1,
    gap: 4,
  },
  articleMetaTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  articleTime: {
    fontSize: 11,
    opacity: 0.5,
  },
  articleTitle: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 19,
  },
  articleExcerpt: {
    fontSize: 12,
    opacity: 0.65,
    lineHeight: 16,
  },
  articleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  articleAuthor: {
    fontSize: 11,
    color: '#0D9488',
    fontWeight: '600',
  },
  articleMinutes: {
    fontSize: 11,
    opacity: 0.5,
  },
  thumbnailImage: {
    width: 76,
    height: 76,
    borderRadius: 10,
    backgroundColor: '#E2E8F0',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.six,
    gap: Spacing.two,
  },
  emptyEmoji: {
    fontSize: 32,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptySub: {
    fontSize: 13,
    opacity: 0.6,
    textAlign: 'center',
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
  formContainer: {
    gap: Spacing.two,
    marginVertical: Spacing.two,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.75,
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: Spacing.two,
    paddingVertical: 8,
    fontSize: 13,
  },
  modalTextArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  catChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: 'rgba(120, 120, 120, 0.08)',
  },
  catChipActive: {
    backgroundColor: 'rgba(13, 148, 136, 0.15)',
  },
  catChipText: {
    fontSize: 11,
    fontWeight: '600',
    opacity: 0.7,
  },
  catChipTextActive: {
    color: '#0D9488',
    fontWeight: '700',
    opacity: 1,
  },
  modalActionButtonsRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  readerHeroImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: Spacing.three,
  },
  readerMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  readerTimeText: {
    fontSize: 11,
    opacity: 0.6,
  },
  readerAuthorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.two,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(120, 120, 120, 0.2)',
    marginBottom: Spacing.three,
  },
  readerBodyContent: {
    fontSize: 14,
    lineHeight: 22,
    opacity: 0.85,
  },
});
