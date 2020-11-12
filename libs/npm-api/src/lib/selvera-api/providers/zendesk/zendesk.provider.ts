import { ApiService } from '../../services'
import { ZendeskArticle } from './entities'

/**
 * Zendesk-related requests
 */
class Zendesk {
  /**
   * Init Api Service
   */
  public constructor(private readonly apiService: ApiService) {}

  public async getAllArticles(): Promise<ZendeskArticle[]> {
    const response = await this.apiService.rawRequest({
      method: 'GET',
      url:
        'https://coachcare.zendesk.com/api/v2/help_center/en-us/categories/360002579931/articles.json?sort_by=created_at&sort_order=desc'
    })

    const articles = response.articles.map(
      (article: any) => new ZendeskArticle(article)
    )

    return articles
  }
}

export { Zendesk }
