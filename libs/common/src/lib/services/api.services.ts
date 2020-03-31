// the same imports here are required by ng-packagr
// tslint:disable-next-line:no-unused-variable
import { InjectionToken } from '@angular/core';
import { ApiService as NewApiService } from '@coachcare/backend/services';
import { APP_ENVIRONMENT } from '@coachcare/common/shared';
import {
  Account,
  Affiliation,
  // ApiLog,
  ApiService,
  // Assignment,
  CCRBlacklist,
  Consultation,
  Country,
  Food,
  FoodKey,
  Goal,
  Hydration,
  Logging,
  MeasurementActivity,
  MeasurementBody,
  MeasurementSleep,
  Messaging,
  MFA,
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

/**
 * Service Factories.
 */
export function AccountFactory(apiService: ApiService) {
  return new Account(apiService);
}
export function AffiliationFactory(apiService: ApiService) {
  return new Affiliation(apiService);
}
// export function ApiLogFactory(apiService: ApiService) {
//   return new ApiLog(apiService);
// }
// export function AssignmentFactory(apiService: ApiService) {
//   return new Assignment(apiService);
// }
export function CCRBlacklistFactory(apiService: ApiService) {
  return new CCRBlacklist(apiService);
}
export function ConsultationFactory(apiService: ApiService) {
  return new Consultation(apiService);
}
export function CountryFactory(apiService: ApiService) {
  return new Country(apiService);
}
export function FoodFactory(apiService: ApiService) {
  return new Food(apiService);
}
export function FoodKeyFactory(apiService: ApiService) {
  return new FoodKey(apiService);
}
export function GoalFactory(apiService: ApiService) {
  return new Goal(apiService);
}
export function HydrationFactory(apiService: ApiService) {
  return new Hydration(apiService);
}
export function LoggingFactory(apiService: ApiService) {
  return new Logging(apiService);
}
export function MeasurementActivityFactory(apiService: ApiService) {
  return new MeasurementActivity(apiService);
}
export function MeasurementBodyFactory(apiService: ApiService) {
  return new MeasurementBody(apiService);
}
export function MeasurementSleepFactory(apiService: ApiService) {
  return new MeasurementSleep(apiService);
}
export function MFAFactory(apiService: ApiService) {
  return new MFA(apiService);
}
export function OrganizationFactory(apiService: ApiService) {
  return new Organization(apiService);
}
export function OrganizationAssociationFactory(apiService: ApiService) {
  return new OrganizationAssociation(apiService);
}
export function MessagingFactory(apiService: ApiService) {
  return new Messaging(apiService);
}
export function MobileAppFactory(apiService: ApiService) {
  return new MobileApp(apiService);
}
export function PhaseFactory(apiService: ApiService) {
  return new Phase(apiService);
}
export function ReportsFactory(apiService: ApiService) {
  return new Reports(apiService);
}
export function ScheduleFactory(apiService: ApiService) {
  return new Schedule(apiService);
}
export function SupplementFactory(apiService: ApiService) {
  return new Supplement(apiService);
}
export function TimezoneFactory() {
  return new Timezone();
}
export function UserFactory(apiService: ApiService) {
  return new User(apiService);
}

/**
 * Service Providers.
 */
export const APIServices = [
  {
    provide: ApiService,
    useExisting: NewApiService,
    deps: [APP_ENVIRONMENT]
  },
  {
    provide: Account,
    useFactory: AccountFactory,
    deps: [ApiService]
  },
  {
    provide: Affiliation,
    useFactory: AffiliationFactory,
    deps: [ApiService]
  },
  // {
  //   provide: ApiLog,
  //   useFactory: ApiLogFactory,
  //   deps: [ApiService]
  // },
  // {
  //   provide: Assignment,
  //   useFactory: AssignmentFactory,
  //   deps: [ApiService]
  // },
  {
    provide: Consultation,
    useFactory: ConsultationFactory,
    deps: [ApiService]
  },
  {
    provide: Country,
    useFactory: CountryFactory,
    deps: [ApiService]
  },
  {
    provide: CCRBlacklist,
    useFactory: CCRBlacklistFactory,
    deps: [ApiService]
  },
  {
    provide: Food,
    useFactory: FoodFactory,
    deps: [ApiService]
  },
  {
    provide: FoodKey,
    useFactory: FoodKeyFactory,
    deps: [ApiService]
  },
  {
    provide: Goal,
    useFactory: GoalFactory,
    deps: [ApiService]
  },
  {
    provide: Hydration,
    useFactory: HydrationFactory,
    deps: [ApiService]
  },
  {
    provide: Logging,
    useFactory: LoggingFactory,
    deps: [ApiService]
  },
  {
    provide: MeasurementActivity,
    useFactory: MeasurementActivityFactory,
    deps: [ApiService]
  },
  {
    provide: MeasurementBody,
    useFactory: MeasurementBodyFactory,
    deps: [ApiService]
  },
  {
    provide: MeasurementSleep,
    useFactory: MeasurementSleepFactory,
    deps: [ApiService]
  },
  {
    provide: MFA,
    useFactory: MFAFactory,
    deps: [ApiService]
  },
  {
    provide: Messaging,
    useFactory: MessagingFactory,
    deps: [ApiService]
  },
  {
    provide: MobileApp,
    useFactory: MobileAppFactory,
    deps: [ApiService]
  },
  {
    provide: Organization,
    useFactory: OrganizationFactory,
    deps: [ApiService]
  },
  {
    provide: OrganizationAssociation,
    useFactory: OrganizationAssociationFactory,
    deps: [ApiService]
  },
  {
    provide: Phase,
    useFactory: PhaseFactory,
    deps: [ApiService]
  },
  {
    provide: Reports,
    useFactory: ReportsFactory,
    deps: [ApiService]
  },
  {
    provide: Schedule,
    useFactory: ScheduleFactory,
    deps: [ApiService]
  },
  {
    provide: Supplement,
    useFactory: SupplementFactory,
    deps: [ApiService]
  },
  {
    provide: Timezone,
    useFactory: TimezoneFactory
  },
  {
    provide: User,
    useFactory: UserFactory,
    deps: [ApiService]
  }
];
