import { HttpClient } from '@angular/common/http';
import { APP_INITIALIZER, LOCALE_ID } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CookieService } from 'ngx-cookie-service';
import {
  Access,
  Account,
  AccountIdentifier,
  Affiliation,
  Alerts,
  ApiService,
  Authentication,
  CommunicationPreference,
  Conference,
  Consultation,
  Content,
  ContentPackage,
  ContentPreference,
  Country,
  Exercise,
  FileVault,
  Food,
  FoodConsumed,
  FoodKey,
  FoodMeal,
  Form,
  FormAddendum,
  FormQuestion,
  FormSection,
  FormSubmission,
  Goal,
  Hydration,
  Interaction,
  Logging,
  MeasurementActivity,
  MeasurementBody,
  MeasurementSleep,
  Messaging,
  MessagingPreference,
  MFA,
  Notes,
  Organization,
  OrganizationAssociation,
  Package,
  PackageEnrollment,
  PackageOrganization,
  Phase,
  Reports,
  RPM,
  Schedule,
  Sequence,
  Supplement,
  Timezone,
  User,
  Zendesk
} from 'selvera-api';
import { DieterDashboardSummary } from 'selvera-api';
import { environment } from '../../environments/environment';

import { CCR_CONFIG, Config } from '@app/config';
import { FormUtils, ViewUtils } from '@app/shared/utils';
import { AppRouteReuseStrategy } from '@app/store/router/reuse/custom.strategy';
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
  TimeTrackerService
} from './';
import { OrphanedAccountGuard } from './guards';
import { WalkthroughService } from './walkthrough';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

/**
 * Service Factories
 */
export function ccrApiFactory() {
  const ccrApiService = new ApiService();
  ccrApiService.setOptionHeaders({
    account: 'provider',
    cookieDomain: environment.cookieDomain,
    appName: environment.appName,
    appVersion: '1.0'
  });

  ccrApiService.setEnvironment(environment.selveraApiEnv, environment.apiUrl);

  return ccrApiService;
}

export function ccrAccessFactory(ccrApiService: ApiService) {
  return new Access(ccrApiService);
}
export function ccrAccountIdentifierFactory(ccrApiService: ApiService) {
  return new AccountIdentifier(ccrApiService);
}
export function ccrAccountFactory(ccrApiService: ApiService) {
  return new Account(ccrApiService);
}
export function ccrAffiliationFactory(ccrApiService: ApiService) {
  return new Affiliation(ccrApiService);
}
export function ccrAlertsFactory(ccrApiService: ApiService) {
  return new Alerts(ccrApiService);
}
export function ccrAuthenticationFactory(ccrApiService: ApiService) {
  return new Authentication(ccrApiService);
}
export function ccrCommunicationPreferenceFactory(ccrApiService: ApiService) {
  return new CommunicationPreference(ccrApiService);
}
export function ccrConsultationFactory(ccrApiService: ApiService) {
  return new Consultation(ccrApiService);
}
export function ccrContentFactory(ccrApiService: ApiService) {
  return new Content(ccrApiService);
}
export function ccrContentPackageFactory(ccrApiService: ApiService) {
  return new ContentPackage(ccrApiService);
}
export function ccrContentPreferenceFactory(ccrApiService: ApiService) {
  return new ContentPreference(ccrApiService);
}
export function ccrCountryFactory(ccrApiService: ApiService) {
  return new Country(ccrApiService);
}
export function ccrExerciseFactory(ccrApiService: ApiService) {
  return new Exercise(ccrApiService);
}
export function ccrFileVaultFactory(ccrApiService: ApiService) {
  return new FileVault(ccrApiService);
}
export function ccrFoodFactory(ccrApiService: ApiService) {
  return new Food(ccrApiService);
}
export function ccrFoodConsumedFactory(ccrApiService: ApiService) {
  return new FoodConsumed(ccrApiService);
}
export function ccrFoodKeyFactory(ccrApiService: ApiService) {
  return new FoodKey(ccrApiService);
}
export function ccrFoodMealFactory(ccrApiService: ApiService) {
  return new FoodMeal(ccrApiService);
}
export function ccrFormFactory(ccrApiService: ApiService) {
  return new Form(ccrApiService);
}
export function ccrFormAddendumFactory(ccrApiService: ApiService) {
  return new FormAddendum(ccrApiService);
}
export function ccrFormQuestionFactory(ccrApiService: ApiService) {
  return new FormQuestion(ccrApiService);
}
export function ccrFormSectionFactory(ccrApiService: ApiService) {
  return new FormSection(ccrApiService);
}
export function ccrFormSubmissionFactory(ccrApiService: ApiService) {
  return new FormSubmission(ccrApiService);
}
export function ccrGoalFactory(ccrApiService: ApiService) {
  return new Goal(ccrApiService);
}
export function ccrHydrationFactory(ccrApiService: ApiService) {
  return new Hydration(ccrApiService);
}
export function ccrInteractionFactory(ccrApiService: ApiService) {
  return new Interaction(ccrApiService);
}
export function ccrLoggingFactory(ccrApiService: ApiService) {
  return new Logging(ccrApiService);
}
export function ccrMeasurementActivityFactory(ccrApiService: ApiService) {
  return new MeasurementActivity(ccrApiService);
}
export function ccrMeasurementBodyFactory(ccrApiService: ApiService) {
  return new MeasurementBody(ccrApiService);
}
export function ccrMeasurementSleepFactory(ccrApiService: ApiService) {
  return new MeasurementSleep(ccrApiService);
}
export function ccrMessagingPreferenceFactory(ccrApiService: ApiService) {
  return new MessagingPreference(ccrApiService);
}
export function ccrMFAFactory(ccrApiService: ApiService) {
  return new MFA(ccrApiService);
}
export function ccrNotesFactory(ccrApiService: ApiService) {
  return new Notes(ccrApiService);
}
export function ccrOrganizationAssociationFactory(ccrApiService: ApiService) {
  return new OrganizationAssociation(ccrApiService);
}
export function ccrOrganizationFactory(ccrApiService: ApiService) {
  return new Organization(ccrApiService);
}
export function ccrMessagingFactory(ccrApiService: ApiService) {
  return new Messaging(ccrApiService);
}
export function ccrPackage(ccrApiService: ApiService) {
  return new Package(ccrApiService);
}
export function ccrPackageEnrollment(ccrApiService: ApiService) {
  return new PackageEnrollment(ccrApiService);
}
export function ccrPackageOrganization(ccrApiService: ApiService) {
  return new PackageOrganization(ccrApiService);
}
export function ccrPhaseFactory(ccrApiService: ApiService) {
  return new Phase(ccrApiService);
}
export function ccrReportsFactory(ccrApiService: ApiService) {
  return new Reports(ccrApiService);
}
export function ccrRPMFactory(ccrApiService: ApiService) {
  return new RPM(ccrApiService);
}
export function ccrScheduleFactory(ccrApiService: ApiService) {
  return new Schedule(ccrApiService);
}
export function ccrSequenceFactory(ccrApiService: ApiService) {
  return new Sequence(ccrApiService);
}
export function ccrSupplementFactory(ccrApiService: ApiService) {
  return new Supplement(ccrApiService);
}
export function ccrTimezoneFactory() {
  return new Timezone();
}
export function ccrUserFactory(ccrApiService: ApiService) {
  return new User(ccrApiService);
}
export function ccrConferenceFactory(ccrApiService: ApiService) {
  return new Conference(ccrApiService);
}
export function ccrZendeskFactory(ccrApiService: ApiService) {
  return new Zendesk(ccrApiService);
}
/**
 * Processors Factories
 */
export function ccrDieterDashboardSummaryFactory(
  account: Account,
  measurementBody: MeasurementBody,
  goal: Goal
) {
  return new DieterDashboardSummary(account, measurementBody, goal);
}

/**
 * APP Initializer
 */
export function onAppInit(context: ContextService) {
  return context.init();
}

export function AppProviders() {
  return [
    // api services
    {
      provide: ApiService,
      useFactory: ccrApiFactory
    },
    { provide: Access, useFactory: ccrAccessFactory, deps: [ApiService] },
    {
      provide: AccountIdentifier,
      useFactory: ccrAccountIdentifierFactory,
      deps: [ApiService]
    },
    {
      provide: Account,
      useFactory: ccrAccountFactory,
      deps: [ApiService]
    },
    {
      provide: Affiliation,
      useFactory: ccrAffiliationFactory,
      deps: [ApiService]
    },
    {
      provide: Alerts,
      useFactory: ccrAlertsFactory,
      deps: [ApiService]
    },
    {
      provide: Authentication,
      useFactory: ccrAuthenticationFactory,
      deps: [ApiService]
    },
    {
      provide: CommunicationPreference,
      useFactory: ccrCommunicationPreferenceFactory,
      deps: [ApiService]
    },
    {
      provide: Conference,
      useFactory: ccrConferenceFactory,
      deps: [ApiService]
    },
    {
      provide: Consultation,
      useFactory: ccrConsultationFactory,
      deps: [ApiService]
    },
    {
      provide: Content,
      useFactory: ccrContentFactory,
      deps: [ApiService]
    },
    {
      provide: ContentPackage,
      useFactory: ccrContentPackageFactory,
      deps: [ApiService]
    },
    {
      provide: ContentPreference,
      useFactory: ccrContentPreferenceFactory,
      deps: [ApiService]
    },
    {
      provide: Country,
      useFactory: ccrCountryFactory,
      deps: [ApiService]
    },
    {
      provide: Exercise,
      useFactory: ccrExerciseFactory,
      deps: [ApiService]
    },
    { provide: FileVault, useFactory: ccrFileVaultFactory, deps: [ApiService] },
    {
      provide: Food,
      useFactory: ccrFoodFactory,
      deps: [ApiService]
    },
    {
      provide: FoodConsumed,
      useFactory: ccrFoodConsumedFactory,
      deps: [ApiService]
    },
    {
      provide: FoodKey,
      useFactory: ccrFoodKeyFactory,
      deps: [ApiService]
    },
    {
      provide: FoodMeal,
      useFactory: ccrFoodMealFactory,
      deps: [ApiService]
    },
    {
      provide: Form,
      useFactory: ccrFormFactory,
      deps: [ApiService]
    },
    {
      provide: FormAddendum,
      useFactory: ccrFormAddendumFactory,
      deps: [ApiService]
    },
    {
      provide: FormQuestion,
      useFactory: ccrFormQuestionFactory,
      deps: [ApiService]
    },
    {
      provide: FormSection,
      useFactory: ccrFormSectionFactory,
      deps: [ApiService]
    },
    {
      provide: FormSubmission,
      useFactory: ccrFormSubmissionFactory,
      deps: [ApiService]
    },
    {
      provide: Goal,
      useFactory: ccrGoalFactory,
      deps: [ApiService]
    },
    {
      provide: Hydration,
      useFactory: ccrHydrationFactory,
      deps: [ApiService]
    },
    {
      provide: Interaction,
      useFactory: ccrInteractionFactory,
      deps: [ApiService]
    },
    {
      provide: Logging,
      useFactory: ccrLoggingFactory,
      deps: [ApiService]
    },
    {
      provide: MeasurementActivity,
      useFactory: ccrMeasurementActivityFactory,
      deps: [ApiService]
    },
    {
      provide: MeasurementBody,
      useFactory: ccrMeasurementBodyFactory,
      deps: [ApiService]
    },
    {
      provide: MeasurementSleep,
      useFactory: ccrMeasurementSleepFactory,
      deps: [ApiService]
    },
    {
      provide: Messaging,
      useFactory: ccrMessagingFactory,
      deps: [ApiService]
    },
    {
      provide: MessagingPreference,
      useFactory: ccrMessagingPreferenceFactory,
      deps: [ApiService]
    },
    {
      provide: MFA,
      useFactory: ccrMFAFactory,
      deps: [ApiService]
    },
    {
      provide: Notes,
      useFactory: ccrNotesFactory,
      deps: [ApiService]
    },
    {
      provide: Organization,
      useFactory: ccrOrganizationFactory,
      deps: [ApiService]
    },
    {
      provide: OrganizationAssociation,
      useFactory: ccrOrganizationAssociationFactory,
      deps: [ApiService]
    },
    {
      provide: Package,
      useFactory: ccrPackage,
      deps: [ApiService]
    },
    {
      provide: PackageEnrollment,
      useFactory: ccrPackageEnrollment,
      deps: [ApiService]
    },
    {
      provide: PackageOrganization,
      useFactory: ccrPackageOrganization,
      deps: [ApiService]
    },
    {
      provide: Phase,
      useFactory: ccrPhaseFactory,
      deps: [ApiService]
    },
    {
      provide: Reports,
      useFactory: ccrReportsFactory,
      deps: [ApiService]
    },
    {
      provide: RPM,
      useFactory: ccrRPMFactory,
      deps: [ApiService]
    },
    {
      provide: Schedule,
      useFactory: ccrScheduleFactory,
      deps: [ApiService]
    },
    {
      provide: Sequence,
      useFactory: ccrSequenceFactory,
      deps: [ApiService]
    },
    {
      provide: Supplement,
      useFactory: ccrSupplementFactory,
      deps: [ApiService]
    },
    {
      provide: Timezone,
      useFactory: ccrTimezoneFactory
    },
    {
      provide: User,
      useFactory: ccrUserFactory,
      deps: [ApiService]
    },
    { provide: Zendesk, useFactory: ccrZendeskFactory, deps: [ApiService] },
    // api processors
    {
      provide: DieterDashboardSummary,
      useFactory: ccrDieterDashboardSummaryFactory,
      deps: [Account, MeasurementBody, Goal]
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
    TimeTrackerService,
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
    WalkthroughService
  ];
}
