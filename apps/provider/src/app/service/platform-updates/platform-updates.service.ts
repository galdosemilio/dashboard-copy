import { Injectable } from '@angular/core'
import { STORAGE_NEWS_LAST_SEEN_TIMESTAMP } from '@app/config'
import { NotifierService } from '@app/service/notifier.service'
import { ZendeskArticle } from '@coachcare/sdk'
import * as moment from 'moment'
import { BehaviorSubject } from 'rxjs'
import { Zendesk } from '@coachcare/sdk'

@Injectable()
export class PlatformUpdatesService {
  public set articles(articles: ZendeskArticle[]) {
    this.articles$.next(articles)
  }

  public get articles(): ZendeskArticle[] {
    return this.articles$.getValue()
  }

  public articles$: BehaviorSubject<ZendeskArticle[]> = new BehaviorSubject<
    ZendeskArticle[]
  >([])
  public state: 'loading' | 'ready' = 'loading'
  public notSeenArticleAmount: number

  private lastSeenTimestamp: string
  private monitoredArticlesAmount = 10

  constructor(private notifier: NotifierService, private zendesk: Zendesk) {
    this.resolveLastSeenTimestamp()
    void this.fetchCurrentArticles()
  }

  public commitLastSeenTimestamp(): void {
    this.lastSeenTimestamp = moment().toISOString()
    window.localStorage.setItem(
      STORAGE_NEWS_LAST_SEEN_TIMESTAMP,
      this.lastSeenTimestamp
    )
    this.notSeenArticleAmount = 0
    this.articles$.next(this.articles)
  }

  public fetchLastSeenTimestamp(): string {
    return this.lastSeenTimestamp
  }

  public hasSeenArticle(article: ZendeskArticle): boolean {
    return this.lastSeenTimestamp
      ? moment(article.createdAt).isSameOrBefore(moment(this.lastSeenTimestamp))
      : false
  }

  private async fetchCurrentArticles(): Promise<void> {
    try {
      this.state = 'loading'

      let articles = await this.zendesk.getAllArticles()

      articles =
        articles.length > this.monitoredArticlesAmount
          ? articles.splice(0, this.monitoredArticlesAmount)
          : articles

      articles = articles.map((article) => ({
        ...article,
        title: article.title.replace(/\(.*?\)/gi, '').trim()
      }))

      this.notSeenArticleAmount = articles.filter(
        (article) => !this.hasSeenArticle(article)
      ).length

      this.articles = articles
    } catch (error) {
      this.notifier.error(error)
    }
  }

  public resolveLastSeenTimestamp(): void {
    // Set min to 2020-09-01, to ensure that new users or existing users aren't immediately met with 10 unread articles
    this.lastSeenTimestamp =
      window.localStorage.getItem(STORAGE_NEWS_LAST_SEEN_TIMESTAMP) ||
      moment().subtract(10, 'weeks').toISOString()
  }
}
