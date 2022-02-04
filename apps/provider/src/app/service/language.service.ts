import { Injectable } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { CookieService } from 'ngx-cookie-service'
import { AccountProvider, ApiService } from '@coachcare/sdk'

import { CCRApp } from '@app/config'
import { Profile } from '@coachcare/sdk'
import { _, locIsRtl } from '@app/shared/utils'
import { ConfigService } from './config.service'
import { EventsService } from './events.service'

import * as moment from 'moment-timezone'
import 'moment'

@Injectable({ providedIn: 'root' })
export class LanguageService {
  public uid: string
  private lang: string
  private langs: Array<string>

  constructor(
    private api: ApiService,
    private account: AccountProvider,
    private config: ConfigService,
    private bus: EventsService,
    private translate: TranslateService,
    private cookie: CookieService
  ) {}

  /**
   * LOCALE_ID
   */
  toLowerCase() {
    return this.lang
  }

  initLanguage(): void {
    const config: CCRApp = this.config.get('app')

    this.langs = config.lang.supported
    this.translate.addLangs(config.lang.supported)
    this.translate.setDefaultLang(config.lang.default)

    this.translate.onLangChange.subscribe((v) => {
      this.update(this.lang)
    })

    if (this.get() && this.translate.getLangs().indexOf(this.get()) > -1) {
      this.use(this.get())
    } else if (
      this.translate.getLangs().indexOf(this.translate.getBrowserLang()) > -1
    ) {
      this.set(this.translate.getBrowserLang())
    } else {
      this.set(config.lang.default)
    }

    this.setupMoment()

    this.bus.listen('user.data', this.setupTimezone.bind(this))
  }

  setupMoment() {
    // momentjs custom settings
    const values = this.config.get('app.moment.thresholds', {
      m: 57,
      h: 24,
      d: 28,
      M: 12
    })

    Object.keys(values).forEach((unit) => {
      moment.relativeTimeThreshold(unit, values[unit])
    })
  }

  setupTimezone(user: Profile) {
    moment.tz.setDefault(user.timezone)
  }

  get(): string {
    if (!this.lang) {
      this.lang = this.cookie.get('ccrStaticLanguage')
    }
    return this.lang
  }

  save(language: string): void {
    this.cookie.set('ccrStaticLanguage', language, null, '/')
    if (this.uid) {
      void this.account
        .update({
          id: this.uid,
          preferredLocales: [language]
        })
        .then(() => {})
    }
  }

  use(language: string): void {
    // validate the input language
    if (this.langs.indexOf(language) === -1) {
      return
    }
    this.lang = language
    this.translate.use(this.lang)
    this.api.setLocales([this.lang])
    moment.updateLocale(this.getLangCode(language), { postformat: null })
  }

  set(language: string): void {
    this.use(language)
    this.save(language)
  }

  update(lang) {
    this.translate
      .get([
        _('MOMENTJS.YESTERDAY'),
        _('MOMENTJS.TODAY'),
        _('MOMENTJS.TOMORROW'),
        _('MOMENTJS.LASWEEK')
      ])
      .subscribe((translations) => {
        moment.updateLocale(this.getLangCode(lang), {
          calendar: {
            lastDay: translations['MOMENTJS.YESTERDAY'],
            sameDay: translations['MOMENTJS.TODAY'],
            nextDay: translations['MOMENTJS.TOMORROW'],
            lastWeek: translations['MOMENTJS.LASWEEK'],
            nextWeek: 'dddd',
            sameElse: 'MMM D, YYYY'
          }
        })
      })
  }

  getLangCode(lang: string): string {
    return lang.split(/[-|_]/)[0]
  }

  getDir() {
    return this.isRtl() ? 'rtl' : 'ltr'
  }

  isRtl() {
    return locIsRtl(this.lang)
  }
}
