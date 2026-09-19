export type ArticleCategory =
  | 'All'
  | 'School News'
  | 'Achievements'
  | 'Announcements'
  | 'Student Life';

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: ArticleCategory;
  author: string;
  authorAvatar?: string;
  publishedAt: string;
  readingTimeMinutes: number;
  featuredImageUrl?: string;
  status: 'published' | 'draft';
}

export interface PublishArticleDTO {
  title: string;
  excerpt: string;
  content: string;
  category: ArticleCategory;
  author: string;
  featuredImageUrl?: string;
  status?: 'published' | 'draft';
}

