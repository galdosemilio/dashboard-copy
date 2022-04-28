import { Component } from '@angular/core'
import {
  ContextService,
  EventsService,
  NotifierService
} from '@coachcare/common/services'
import { Authentication, MobileApp } from '@coachcare/sdk'
import { TranslateService } from '@ngx-translate/core'
import * as moment from 'moment'

@Component({
  selector: 'ccr-checkout-muslewise-order-confirm',
  templateUrl: './musclewise-order-confirm.component.html',
  styleUrls: ['../bluesky/bluesky-order-confirm.component.scss']
})
export class MuscleWiseOrderConfirmComponent {
  public androidLink: string
  public androidButtonLink: string
  public iosLink: string
  public iosButtonLink: string
  public today: moment.Moment
  public inOneYear: moment.Moment

  constructor(
    private authentication: Authentication,
    private bus: EventsService,
    private context: ContextService,
    private mobileApp: MobileApp,
    private notifier: NotifierService,
    private translate: TranslateService
  ) {
    this.startRedirection = this.startRedirection.bind(this)
  }

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
    this.bus.register('checkout.redirection.start', this.startRedirection)
  }

  private async startRedirection(): Promise<void> {
    try {
      const res = await this.authentication.shopify({
        organization: this.context.organizationId
      })
      window.location.href = res.url
    } catch (error) {
      this.notifier.error(error)
    }
  }
}
