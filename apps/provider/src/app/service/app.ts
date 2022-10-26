import { APP_INITIALIZER, LOCALE_ID } from '@angular/core'
import { RouteReuseStrategy } from '@angular/router'
import { CookieService } from 'ngx-cookie-service'
import { APP_CONFIG } from '@coachcare/common/shared'
import {
  AccountProvider,
  ApiService,
  GoalV2,
  MeasurementDataPointProvider,
  Messaging
} from '@coachcare/sdk'
import { DieterDashboardSummary } from '@coachcare/sdk'

import { catalogs, CCR_CONFIG, Config } from '@app/config'
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
import { MeasurementDatabaseV2 } from './measurement-v2'
import {
  ConfigService,
  ContextService,
  EventsService,
  I18N_CATALOGS,
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
import { MeasurementAggregatesDatabase } from './measurement-aggregates'

/**
 * Processors Factories
 */
export function ccrDieterDashboardSummaryFactory(
  account: AccountProvider,
  measurementBody: MeasurementDataPointProvider,
  goalV2: GoalV2
) {
  return new DieterDashboardSummary(account, measurementBody, goalV2)
}

// /**
//  * APP Initializer
//  */
export function onAppInit(context: ContextService) {
  return context.init()
}

export function AppProviders() {
  return [
    {
      provide: I18N_CATALOGS,
      useValue: catalogs,
      multi: false
    },
    // api processors
    {
      provide: DieterDashboardSummary,
      useFactory: ccrDieterDashboardSummaryFactory,
      deps: [AccountProvider, MeasurementDataPointProvider, GoalV2]
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
    MeasurementDatabaseV2,
    MeasurementAggregatesDatabase,
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
