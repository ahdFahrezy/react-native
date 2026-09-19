import { Article, PublishArticleDTO } from '@/types/article.types';
import { simulateDelay } from './helper';
import { logger } from '@/utils/logger';

const log = logger.createScope('ArticleDummyApi');

let mockArticles: Article[] = [
  {
    id: 'art_001',
    title: 'National Champions: Bintang Bangsa Robotics Team Wins Gold at 2025 Olympiad',
    excerpt:
      'The high school robotics squad swept the competition with their autonomous disaster-relief prototype robot.',
    content:
      'SMA Bintang Bangsa has once again proven national excellence. Competing against 120 schools from across the country, our senior robotics division achieved 1st place in the Autonomous Engineering Challenge.',
    category: 'Achievements',
    author: 'Nurul Hidayah, S.Pd',
    authorAvatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBt_ahmoxI0ElvcvLlf905w1c6k5yDz-wQQxpa7f2P6Sh2LPpY9O3-7HXmrDkKqI_rSf-3x0aaMmiVUybLFJYgOxDdLkghOQ2c2F2eE0mMwHrEOh0iBMJlFVxJ1pTVcMmyiW3pA5_YMcOvaWLfZgvuqNVS55ZJhTLNt5WaeczdQDyvLwhEJzdyzSlkau1N1LxN_AHB-RWmR6VbI-RNRZfEByK0CGbfBj9OKlVtjiIxT0EfriAqG-eFM',
    publishedAt: 'Today, 10:00 AM',
    readingTimeMinutes: 4,
    featuredImageUrl:
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600',
    status: 'published',
  },
  {
    id: 'art_002',
    title: 'Physical Document Verification Schedule for PPDB Academic Track Wave 1',
    excerpt:
      'Important guidelines and schedule for parents and candidates attending physical document cross-checks.',
    content:
      'The admission committee has finalized the on-campus verification dates for Academic Track registrants. Sessions are split into morning and afternoon cohorts.',
    category: 'Announcements',
    author: 'Admissions Office',
    publishedAt: 'Yesterday',
    readingTimeMinutes: 3,
    featuredImageUrl:
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600',
    status: 'published',
  },
  {
    id: 'art_003',
    title: 'Annual Science & Tech Fair 2025: Innovation and Digital Future',
    excerpt:
      'Over 40 student-led research exhibits will be presented in the school auditorium this Friday.',
    content:
      'Parents, alumni, and education partners are cordially invited to witness groundbreaking physics, chemistry, and software engineering projects created by our students.',
    category: 'School News',
    author: 'Science Faculty',
    publishedAt: '3 days ago',
    readingTimeMinutes: 5,
    featuredImageUrl:
      'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=600',
    status: 'published',
  },
  {
    id: 'art_004',
    title: 'New Digital Learning Labs & Smart Classroom Rollout Completed',
    excerpt:
      'Every classroom now features interactive digital displays and fiber-optic connected devices.',
    content:
      'The school infrastructure modernization plan has reached 100% completion, equipping all students with state-of-the-art interactive learning workstations.',
    category: 'Student Life',
    author: 'IT Infrastructure Team',
    publishedAt: '5 days ago',
    readingTimeMinutes: 3,
    featuredImageUrl:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600',
    status: 'published',
  },
];

export class ArticleDummyApi {
  async getAll(): Promise<Article[]> {
    log.info('[DummyAPI] Fetching all articles');
    await simulateDelay(200);
    return [...mockArticles];
  }

  async getById(id: string): Promise<Article> {
    log.info(`[DummyAPI] Fetching article by id: ${id}`);
    await simulateDelay(140);
    const item = mockArticles.find((a) => a.id === id);
    if (!item) {
      throw new Error('Article not found');
    }
    return item;
  }

  async publish(payload: PublishArticleDTO): Promise<Article> {
    const isDraft = payload.status === 'draft';
    log.info(`[DummyAPI] ${isDraft ? 'Saving article draft' : 'Publishing article'}: ${payload.title}`);
    await simulateDelay(260);

    const newArticle: Article = {
      id: `art_${Date.now()}`,
      title: payload.title,
      excerpt: payload.excerpt || payload.content.slice(0, 100) + '...',
      content: payload.content,
      category: payload.category || 'School News',
      author: payload.author || 'Nurul Hidayah, S.Pd',
      authorAvatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBt_ahmoxI0ElvcvLlf905w1c6k5yDz-wQQxpa7f2P6Sh2LPpY9O3-7HXmrDkKqI_rSf-3x0aaMmiVUybLFJYgOxDdLkghOQ2c2F2eE0mMwHrEOh0iBMJlFVxJ1pTVcMmyiW3pA5_YMcOvaWLfZgvuqNVS55ZJhTLNt5WaeczdQDyvLwhEJzdyzSlkau1N1LxN_AHB-RWmR6VbI-RNRZfEByK0CGbfBj9OKlVtjiIxT0EfriAqG-eFM',
      publishedAt: isDraft ? 'Draft (Unpublished)' : 'Just now',
      readingTimeMinutes: Math.max(1, Math.ceil(payload.content.split(' ').length / 150)),
      featuredImageUrl:
        payload.featuredImageUrl ||
        'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600',
      status: payload.status || 'published',
    };
    mockArticles.unshift(newArticle);
    log.info(`[DummyAPI] Article created with ID: ${newArticle.id}, status: ${newArticle.status}`);
    return newArticle;
  }
}

export const articleDummyApi = new ArticleDummyApi();
