import { Injectable } from '@angular/core'
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'

import { AccountSingle, ApiService } from '@coachcare/npm-api'
import { _ } from '@coachcare/backend/shared'
import {
  AppSettings,
  loc2API,
  locales,
  locBase,
  locIsRtl
} from '@coachcare/common/shared'

import { ConfigService } from './config.service'
import { COOKIE_LANG, CookieService } from './cookie.service'
import { EventsService } from './events.service'

import * as momentNs from 'moment-timezone'
const moment = momentNs

import 'moment/locale/ar'
import 'moment/locale/da'
import 'moment/locale/he'
import './i18n/moment.en'
import './i18n/moment.es'

/**
 * Language Service
 */
@Injectable()
export class LanguageService {
  private lang: string
  public localesBlacklist: Array<string> = []

  constructor(
    private api: ApiService,
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

  init() {
    const config: AppSettings = this.config.get('app')

    this.translate.addLangs(locales.map(loc2API))

    this.translate.onLangChange.subscribe((v: LangChangeEvent) => {
      this.update(v.lang)
    })

    let lang
    if (this.get() && this.translate.getLangs().indexOf(this.get()) > -1) {
      lang = this.get()
    } else if (
      this.translate.getLangs().indexOf(this.translate.getBrowserLang()) > -1
    ) {
      lang = this.translate.getBrowserLang()
    } else {
      lang = config.lang.default
    }
    this.use(lang || 'en')

    this.setupMoment()

    this.bus.register('user.data', this.setupTimezone.bind(this))
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

  setupTimezone(user: AccountSingle) {
    moment.tz.setDefault(user.timezone)
  }

  resolve(languages: Array<string>): string {
    const exists = (lang: string) => languages.indexOf(lang) >= 0

    if (exists(this.lang)) {
      return this.lang
    }
    if (this.lang !== locBase(this.lang) && exists(locBase(this.lang))) {
      return locBase(this.lang)
    }
    // TODO consider preferredLocales?
    return 'en'
  }

  get(): string {
    if (!this.lang) {
      this.lang = this.cookie.get(COOKIE_LANG)
    }
    return this.lang
  }

  save(language: string) {
    this.cookie.set(COOKIE_LANG, language, undefined, '/')
  }

  use(language: string) {
    this.lang = language
    this.translate.use(this.lang)
    this.api.setLocales([this.lang])
    moment.locale(locBase(this.lang))
  }

  set(language: string) {
    this.use(language)
    this.save(language)
  }

  update(lang: string) {
    this.translate
      .get([
        _('MOMENTJS.YESTERDAY'),
        _('MOMENTJS.TODAY'),
        _('MOMENTJS.TOMORROW'),
        _('MOMENTJS.LASWEEK')
      ])
      .subscribe((translations) => {
        moment.updateLocale(locBase(this.lang), {
          calendar: {
            lastDay: translations['MOMENTJS.YESTERDAY'],
            sameDay: translations['MOMENTJS.TODAY'],
            nextDay: translations['MOMENTJS.TOMORROW'],
            lastWeek: translations['MOMENTJS.LASWEEK'],
            // TODO use global dateformat config here
            nextWeek: 'dddd',
            sameElse: 'MMM D, YYYY'
          }
        })
      })
  }

  isRtl() {
    return locIsRtl(this.lang)
  }

  getDir() {
    return this.isRtl() ? 'rtl' : 'ltr'
  }
}
