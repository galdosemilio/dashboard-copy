import { HttpClient } from '@angular/common/http';
// tslint:disable-next-line:no-unused-variable
import { APP_INITIALIZER, InjectionToken, LOCALE_ID } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';
import { FormUtils, ViewUtils } from '@coachcare/backend/shared';
import {
  APP_CONFIG,
  APP_ENVIRONMENT,
  AppConfig,
  AppEnvironment
} from '@coachcare/common/shared';
// tslint:disable-next-line:no-unused-variable
import {
  Account,
  // AccountV2,
  Affiliation,
  // ApiLog,
  ApiService,
  // Assignment,
  CCRBlacklist,
  Consultation,
  Food,
  FoodKey,
  Goal,
  Hydration,
  Logging,
  MeasurementActivity,
  MeasurementBody,
  MeasurementSleep,
  Messaging,
  MobileApp,
  Organization,
  OrganizationAssociation,
  Phase,
  Reports,
  Schedule,
  Supplement,
  Timezone,
  User
} from 'selvera-api';
import { APIServices } from './api.services';
import { onAppInit } from './app.init';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { ConfigService } from './config.service';
import { ContextService } from './context.service';
import { CookieService } from './cookie.service';
import { EventsService } from './events.service';
import { I18N_CATALOGS, TranslateCatalogs } from './i18n/loader';
import { LanguageService } from './language.service';
import { LayoutService } from './layout.service';
import { NotifierService } from './notifier.service';
import { StripeService } from './stripe.service';

import { AppRouteReuseStrategy } from './router/custom.reuse-strategy';

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
    // api service
    ...APIServices,
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
    ViewUtils
  ];
}
