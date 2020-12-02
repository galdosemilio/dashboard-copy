import { Component, OnDestroy, OnInit } from '@angular/core'
import { PlatformUpdatesService } from '@app/service'
import { ZendeskArticle } from '@coachcare/npm-api'
import { TranslateService } from '@ngx-translate/core'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

@UntilDestroy()
@Component({
  selector: 'app-platform-updates',
  templateUrl: './platform-updates.component.html',
  styleUrls: ['./platform-updates.component.scss']
})
export class PlatformUpdatesComponent implements OnDestroy, OnInit {
  public articles: ZendeskArticle[] = []
  public readArticles: string[] = []
  public currentLang: string
  public lastSeenTimestamp: string

  constructor(
    private platformUpdates: PlatformUpdatesService,
    private translate: TranslateService
  ) {}

  public ngOnDestroy(): void {}

  public ngOnInit(): void {
    this.lastSeenTimestamp = this.platformUpdates.fetchLastSeenTimestamp()
    this.platformUpdates.commitLastSeenTimestamp()
    this.currentLang = this.extractRootLang(this.translate.currentLang) || 'en'
    this.subscribeToSource()
  }

  public markAsRead(articleId: string): void {
    this.readArticles.push(articleId)
  }

  private subscribeToSource(): void {
    this.translate.onLangChange
      .pipe(untilDestroyed(this))
      .subscribe((event) => {
        this.currentLang = this.extractRootLang(event.lang) || 'en'
      })

    this.platformUpdates.articles$
      .pipe(untilDestroyed(this))
      .subscribe((articles) => (this.articles = articles))
  }

  private extractRootLang(lang: string): string {
    return lang.split('-')[0] || lang
  }
}
