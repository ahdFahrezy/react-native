import { useState, useEffect, useCallback } from 'react';
import { fetchArticleListService } from '@/services/article/fetchArticleListService';
import { publishArticleService } from '@/services/article/publishArticleService';
import { Article, ArticleCategory, PublishArticleDTO } from '@/types/article.types';

export function useArticles(autoFetch = true) {
  const [data, setData] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ArticleCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await fetchArticleListService.execute();
      setData(items);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch articles');
    } finally {
      setLoading(false);
    }
  }, []);

  const publishArticle = useCallback(async (payload: PublishArticleDTO) => {
    const created = await publishArticleService.execute(payload);
    setData((prev) => [created, ...prev]);
    return created;
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchArticles();
    }
  }, [autoFetch, fetchArticles]);

  const filteredArticles = data.filter((article) => {
    const matchesCategory =
      selectedCategory === 'All' || article.category === selectedCategory;
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return {
    data: filteredArticles,
    allArticles: data,
    loading,
    error,
    refetch: fetchArticles,
    publishArticle,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
  };
}
