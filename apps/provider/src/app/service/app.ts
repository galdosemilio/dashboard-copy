import { HttpClient } from '@angular/common/http'
import { APP_INITIALIZER, LOCALE_ID } from '@angular/core'
import { RouteReuseStrategy } from '@angular/router'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { CookieService } from 'ngx-cookie-service'
import { APP_CONFIG } from '@coachcare/common/shared'
import {
  AccountProvider,
  ApiService,
  Goal,
  MeasurementBody,
  Messaging
} from '@coachcare/sdk'
import { DieterDashboardSummary } from '@coachcare/sdk'

import { CCR_CONFIG, Config } from '@app/config'
import { FormUtils, ViewUtils } from '@app/shared/utils'
import { AppRouteReuseStrategy } from '@app/store/router/reuse/custom.strategy'
import {
  AuthGuard,
  AuthService,
  ConferenceGuard,
  ConfigService as LocalConfigService,
  ContextService as LocalContextService,
  EventsService as LocalEventsService,
  LanguageService,
  ListingPaginationGuard,
  LoggingService,
  NotifierService as LocalNotifierService,
  PlatformUpdatesService,
  ScheduleDataService,
  TimeTrackerService
} from './'
import {
  OrphanedAccountGuard,
  PatientAccountGuard,
  ProviderAccountGuard
} from './guards'
import { WalkthroughService } from './walkthrough'
import { GestureService } from './gesture'
import { DietersDatabase } from './dieters'
import { FormPDFService } from './formPDFService'
import { MessagingService } from './messaging'
import { MeasurementLabelService } from './measurement-label'
import { MeasurementDatabaseV2 } from './measurement-v2'
import {
  ConfigService,
  ContextService,
  EventsService,
  NotifierService
} from '@coachcare/common/services'
import { SequencesDatabase } from './sequences'
import { AccountIdentifierSyncer } from './account-identifier-syncer'
import {
  FormAddendumDatabase,
  FormDisplayService,
  FormsDatabase,
  FormSubmissionsDatabase
} from './forms'

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
    LocalConfigService,
    { provide: ConfigService, useExisting: LocalConfigService },
    LocalContextService,
    { provide: ContextService, useExisting: LocalContextService },
    CookieService,
    DietersDatabase,
    LocalEventsService,
    { provide: EventsService, useExisting: LocalEventsService },
    LanguageService,
    LocalNotifierService,
    ListingPaginationGuard,
    LoggingService,
    MeasurementLabelService,
    MeasurementDatabaseV2,
    { provide: NotifierService, useExisting: LocalNotifierService },
    {
      provide: MessagingService,
      deps: [
        ApiService,
        Messaging,
        ContextService,
        ConfigService,
        NotifierService
      ]
    },
    OrphanedAccountGuard,
    PatientAccountGuard,
    ProviderAccountGuard,
    PlatformUpdatesService,
    SequencesDatabase,
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
    GestureService,

    // App-related Services
    FormAddendumDatabase,
    FormsDatabase,
    FormDisplayService,
    FormSubmissionsDatabase,
    AccountIdentifierSyncer
  ]
}
