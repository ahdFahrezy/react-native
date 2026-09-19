import { apiClient } from '@/api/apiClient';
import { articleDummyApi, USE_DUMMY_API } from '@/dummy';
import { Article, PublishArticleDTO } from '@/types/article.types';

export interface IArticleRepository {
  getAll(): Promise<Article[]>;
  getById(id: string): Promise<Article>;
  publish(payload: PublishArticleDTO): Promise<Article>;
}

export class ArticleRepository implements IArticleRepository {
  async getAll(): Promise<Article[]> {
    if (USE_DUMMY_API) {
      return articleDummyApi.getAll();
    }
    return apiClient.get<Article[]>('/articles');
  }

  async getById(id: string): Promise<Article> {
    if (USE_DUMMY_API) {
      return articleDummyApi.getById(id);
    }
    return apiClient.get<Article>(`/articles/${id}`);
  }

  async publish(payload: PublishArticleDTO): Promise<Article> {
    if (USE_DUMMY_API) {
      return articleDummyApi.publish(payload);
    }
    return apiClient.post<Article>('/articles', payload);
  }
}

export const articleRepository = new ArticleRepository();
