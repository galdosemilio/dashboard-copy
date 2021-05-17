import { HttpClient } from '@angular/common/http'
import { APP_INITIALIZER, LOCALE_ID } from '@angular/core'
import { RouteReuseStrategy } from '@angular/router'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { CookieService } from 'ngx-cookie-service'
import { AccountProvider, Goal, MeasurementBody } from '@coachcare/sdk'
import { DieterDashboardSummary } from '@coachcare/sdk'

import { CCR_CONFIG, Config } from '@app/config'
import { FormUtils, ViewUtils } from '@app/shared/utils'
import { AppRouteReuseStrategy } from '@app/store/router/reuse/custom.strategy'
import {
  AuthGuard,
  AuthService,
  ConferenceGuard,
  ConfigService,
  ContextService,
  EventsService,
  LanguageService,
  ListingPaginationGuard,
  LoggingService,
  NotifierService,
  PlatformUpdatesService,
  ScheduleDataService,
  TimeTrackerService
} from './'
import { OrphanedAccountGuard } from './guards'
import { WalkthroughService } from './walkthrough'
import { GestureService } from './gesture'
import { APP_CONFIG } from '@coachcare/common/shared'
import { FormPDFService } from './formPDFService'

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json')
}

/**
 * Processors Factories
 */
export function ccrDieterDashboardSummaryFactory(
  account: AccountProvider,
  measurementBody: MeasurementBody,
  goal: Goal
) {
  return new DieterDashboardSummary(account, measurementBody, goal)
}

// /**
//  * APP Initializer
//  */
export function onAppInit(context: ContextService) {
  return context.init()
}

export function AppProviders() {
  return [
    // api processors
    {
      provide: DieterDashboardSummary,
      useFactory: ccrDieterDashboardSummaryFactory,
      deps: [AccountProvider, MeasurementBody, Goal]
    },
    // angular providers
    {
      provide: RouteReuseStrategy,
      useClass: AppRouteReuseStrategy
    },
    // site services
    {
      provide: CCR_CONFIG,
      useValue: Config
    },
    {
      provide: APP_CONFIG,
      useValue: Config
    },
    AuthGuard,
    ConferenceGuard,
    AuthService,
    ConfigService,
    ContextService,
    CookieService,
    EventsService,
    LanguageService,
    ListingPaginationGuard,
    LoggingService,
    NotifierService,
    OrphanedAccountGuard,
    PlatformUpdatesService,
    ScheduleDataService,
    TimeTrackerService,
    FormPDFService,
    {
      provide: LOCALE_ID,
      useExisting: LanguageService
    },
    {
      provide: APP_INITIALIZER,
      useFactory: onAppInit,
      deps: [ContextService],
      multi: true
    },
    // view helpers
    FormUtils,
    ViewUtils,
    WalkthroughService,
    GestureService
  ]
}
