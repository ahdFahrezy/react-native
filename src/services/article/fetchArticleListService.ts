import { articleRepository, IArticleRepository } from '@/repositories/articleRepository';
import { Article } from '@/types/article.types';
import { logger } from '@/utils/logger';

const log = logger.createScope('FetchArticleListService');

export class FetchArticleListService {
  constructor(private readonly repo: IArticleRepository = articleRepository) {}

  async execute(): Promise<Article[]> {
    log.info('Fetching article list...');
    const list = await this.repo.getAll();
    log.info(`Successfully fetched ${list.length} articles`);
    return list;
  }
}

export const fetchArticleListService = new FetchArticleListService();
