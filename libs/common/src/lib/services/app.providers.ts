import { HttpClient } from '@angular/common/http'
// eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
import { APP_INITIALIZER, InjectionToken, LOCALE_ID } from '@angular/core'
import { RouteReuseStrategy } from '@angular/router'
import {
  APP_CONFIG,
  APP_ENVIRONMENT,
  AppConfig,
  AppEnvironment,
  FormUtils,
  ViewUtils
} from '@coachcare/common/shared'
import { onAppInit } from './app.init'
import { AuthGuard } from './auth.guard'
import { AuthService } from './auth.service'
import { ConfigService } from './config.service'
import { ContextService } from './context.service'
import { CookieService } from './cookie.service'
import { EventsService } from './events.service'
import { I18N_CATALOGS, TranslateCatalogs } from './i18n/loader'
import { LanguageService } from './language.service'
import { LayoutService } from './layout.service'
import { NotifierService } from './notifier.service'
import { StripeService } from './stripe.service'

import { AppRouteReuseStrategy } from './router/custom.reuse-strategy'
import { CcrOrganizationDialogs } from './organization'

export function AppProviders(
  environment: AppEnvironment,
  config: AppConfig,
  catalogs: TranslateCatalogs
) {
  return [
    HttpClient,
    // ccr services
    {
      provide: APP_ENVIRONMENT,
      useValue: environment
    },
    {
      provide: APP_CONFIG,
      useValue: config
    },
    {
      provide: I18N_CATALOGS,
      useValue: catalogs,
      multi: false
    },
    {
      provide: LOCALE_ID,
      useExisting: LanguageService
    },
    // site services
    CookieService,
    AuthGuard,
    AuthService,
    ConfigService,
    ContextService,
    EventsService,
    LanguageService,
    LayoutService,
    NotifierService,
    StripeService,
    // app initializer
    {
      provide: APP_INITIALIZER,
      useFactory: onAppInit,
      deps: [ContextService],
      multi: true
    },
    // angular providers
    {
      provide: RouteReuseStrategy,
      useClass: AppRouteReuseStrategy
    },
    // view helpers
    FormUtils,
    ViewUtils,
    CcrOrganizationDialogs
  ]
}
