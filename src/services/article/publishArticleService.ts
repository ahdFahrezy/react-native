import { articleRepository, IArticleRepository } from '@/repositories/articleRepository';
import { Article, PublishArticleDTO } from '@/types/article.types';
import { logger } from '@/utils/logger';

const log = logger.createScope('PublishArticleService');

export class PublishArticleService {
  constructor(private readonly repo: IArticleRepository = articleRepository) {}

  async execute(payload: PublishArticleDTO): Promise<Article> {
    if (!payload.title || payload.title.trim().length === 0) {
      throw new Error('Article title is required.');
    }
    if (!payload.content || payload.content.trim().length === 0) {
      throw new Error('Article content is required.');
    }
    log.info(`Publishing article: ${payload.title}`, payload);
    const result = await this.repo.publish(payload);
    log.info(`Article published successfully: ${result.id}`);
    return result;
  }
}

export const publishArticleService = new PublishArticleService();
