import { Component, OnInit } from '@angular/core'
import { ContextService, EventsService } from '@coachcare/common/services'
import { MobileApp } from '@coachcare/sdk'
import { TranslateService } from '@ngx-translate/core'
import * as moment from 'moment'

@Component({
  selector: 'ccr-bluesky-order-confirm',
  templateUrl: './bluesky-order-confirm.component.html',
  styleUrls: ['./bluesky-order-confirm.component.scss']
})
export class BlueskyOrderConfirmComponent implements OnInit {
  public androidLink: string
  public androidButtonLink: string
  public iosLink: string
  public iosButtonLink: string
  public today: moment.Moment
  public inOneYear: moment.Moment

  constructor(
    private bus: EventsService,
    private context: ContextService,
    private mobileApp: MobileApp,
    private translate: TranslateService
  ) {}

  public ngOnInit(): void {
    this.resolveBadgeLinks(
      this.translate.currentLang.split('-')[0].toLowerCase()
    )

    void this.resolveMobileAppRedirects()

    this.today = moment()
    this.inOneYear = this.today.clone().add(1, 'year').subtract(1, 'day')

    this.subscribeToEvents()
  }

  private resolveBadgeLinks(lang: string) {
    this.androidButtonLink = `/assets/badges/${lang}-play-store-badge.png`
    this.iosButtonLink = `/assets/badges/${lang}-app-store-badge.png`
  }

  private async resolveMobileAppRedirects() {
    try {
      this.androidLink = (
        await this.mobileApp.getAndroidRedirect({
          id: this.context.organizationId || ''
        })
      ).redirect
    } catch (error) {}

    try {
      this.iosLink = (
        await this.mobileApp.getiOsRedirect({
          id: this.context.organizationId || ''
        })
      ).redirect
    } catch (error) {}
  }

  private subscribeToEvents(): void {
    this.bus.register(
      'checkout.redirection.start',
      () => (window.location.href = window.location.origin)
    )
  }
}
