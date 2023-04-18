import {
  Access,
  AccountIdentifier,
  AccountPassword,
  AccountPreference,
  AccountProvider,
  AddressProvider,
  Affiliation,
  Alerts,
  ApiService,
  Authentication,
  AuthenticationToken,
  CareManagementPreference,
  CareManagementProvider,
  CCRBlacklist,
  Chart,
  CommunicationPreference,
  Conference,
  Content,
  ContentPackage,
  ContentPreference,
  CountryProvider,
  Device,
  EmailProvider,
  Exercise,
  ExerciseAssociation,
  ExerciseType,
  Feedback,
  FileVault,
  Food,
  FoodConsumed,
  FoodFavorite,
  FoodIngredient,
  FoodKey,
  FoodMeal,
  FoodMealOrganization,
  FoodMealServing,
  FoodPreference,
  FoodServing,
  FoodV2,
  Form,
  FormAddendum,
  FormQuestion,
  FormQuestionType,
  FormSection,
  FormSubmission,
  GoalV2,
  Hydration,
  Idealshape,
  Interaction,
  Logging,
  MALA,
  MFA,
  MeasurementDataPointProvider,
  Messaging,
  MessagingPermission,
  MessagingPreference,
  MobileApp,
  Notification,
  OrganizationAssignment,
  OrganizationAssociation,
  OrganizationPreference,
  OrganizationProvider,
  Package,
  PackageEnrollment,
  PackageOrganization,
  Phase,
  RPM,
  Register,
  Reports,
  Schedule,
  Sequence,
  Session,
  Supplement,
  Task,
  Timezone,
  User,
  Zendesk,
  MeasurementPreferenceProvider,
  MeasurementLabelProvider,
  MeasurementDataPointTypeProvider,
  SpreeProvider,
  EcommerceProvider
} from '@coachcare/sdk'

import { ApiHeaders } from '@coachcare/sdk/dist/lib/services/api-headers'
import { environment } from './environments/environment'
import { Environment } from './environments/environment.interface'

export const authenticationToken = new AuthenticationToken()
export const SDK_HEADERS = new ApiHeaders()

export const resolveApiUrl = (
  env: Environment,
  origin: string
): {
  apiUrl: string
  cookieDomain: string
} => {
  const whiteListHost = env.hostWhitelist?.find((entry) =>
    origin?.endsWith(entry)
  )

  if (whiteListHost && origin?.includes('dashboard.')) {
    const apiUrl = `${origin.replace('dashboard.', 'api.')}/`
    const cookieDomain = parseUrl(apiUrl)?.host

    return {
      apiUrl,
      cookieDomain
    }
  }
}

const parseUrl = (url) => {
  try {
    return new URL(url)
  } catch (err) {
    //
  }
}

const errorHandlingSettings = {
  enabled: true,
  options: { [401]: { enabled: true }, [403]: { enabled: true } }
}

const generalThrottlingSettings = environment.enableThrottling
  ? environment.ccrApiEnv === 'prod'
    ? { enabled: true, options: { defaultRateLimit: 15 } }
    : { enabled: true, options: { defaultRateLimit: 10 } }
  : { enabled: false }

const generalApiService = new ApiService({
  token: authenticationToken,
  caching: { enabled: false },
  throttling: generalThrottlingSettings,
  headers: SDK_HEADERS,
  errorHandling: errorHandlingSettings
})

const measurementApiService = new ApiService({
  token: authenticationToken,
  caching: { enabled: false },
  throttling: environment.enableThrottling
    ? {
        enabled: true,
        options: { headers: { enabled: false }, defaultRateLimit: 2 }
      }
    : { enabled: false },
  headers: SDK_HEADERS,
  errorHandling: errorHandlingSettings
})

const messagingApiService = new ApiService({
  token: authenticationToken,
  caching: { enabled: false },
  throttling: generalThrottlingSettings,
  headers: SDK_HEADERS,
  errorHandling: {
    enabled: true,
    options: {
      [403]: { enabled: true, type: 'object' },
      [401]: { enabled: true }
    }
  }
})

const apiUrlData = resolveApiUrl(environment, window.location.origin)

generalApiService.setEnvironment(environment.ccrApiEnv, apiUrlData?.apiUrl)
measurementApiService.setEnvironment(environment.ccrApiEnv, apiUrlData?.apiUrl)
messagingApiService.setEnvironment(environment.ccrApiEnv, apiUrlData?.apiUrl)

if (apiUrlData?.cookieDomain) {
  generalApiService.appendHeaders({ cookieDomain: apiUrlData.cookieDomain })
  measurementApiService.appendHeaders({ cookieDomain: apiUrlData.cookieDomain })
  messagingApiService.appendHeaders({ cookieDomain: apiUrlData.cookieDomain })
}

export const SdkApiProviders = [
  {
    provide: measurementApiService,
    useValue: measurementApiService
  },
  { provide: messagingApiService, useValue: messagingApiService },
  {
    provide: ApiService,
    useValue: generalApiService
  },
  {
    provide: AccountProvider,
    useClass: AccountProvider,
    deps: [ApiService]
  },
  {
    provide: Access,
    useClass: Access,
    deps: [ApiService]
  },
  {
    provide: AccountIdentifier,
    useClass: AccountIdentifier,
    deps: [ApiService]
  },
  {
    provide: AccountPassword,
    useClass: AccountPassword,
    deps: [ApiService]
  },
  {
    provide: AccountPreference,
    useClass: AccountPreference,
    deps: [ApiService]
  },
  { provide: AddressProvider, useClass: AddressProvider, deps: [ApiService] },
  { provide: Authentication, useClass: Authentication, deps: [ApiService] },
  { provide: Affiliation, useClass: Affiliation, deps: [ApiService] },
  { provide: Alerts, useClass: Alerts, deps: [ApiService] },
  {
    provide: CareManagementPreference,
    useClass: CareManagementPreference,
    deps: [ApiService]
  },
  {
    provide: CareManagementProvider,
    useClass: CareManagementProvider,
    deps: [ApiService]
  },
  { provide: CCRBlacklist, useClass: CCRBlacklist, deps: [ApiService] },
  { provide: Chart, useClass: Chart, deps: [ApiService] },
  {
    provide: CommunicationPreference,
    useClass: CommunicationPreference,
    deps: [ApiService]
  },
  { provide: Conference, useClass: Conference, deps: [ApiService] },
  { provide: Content, useClass: Content, deps: [ApiService] },
  { provide: ContentPackage, useClass: ContentPackage, deps: [ApiService] },
  {
    provide: ContentPreference,
    useClass: ContentPreference,
    deps: [ApiService]
  },
  // { provide: Consultation, useClass: Consultation, deps: [ApiService] },
  { provide: CountryProvider, useClass: CountryProvider, deps: [ApiService] },
  { provide: Device, useClass: Device, deps: [ApiService] },
  {
    provide: EcommerceProvider,
    useClass: EcommerceProvider,
    deps: [ApiService]
  },
  { provide: EmailProvider, useClass: EmailProvider, deps: [ApiService] },
  { provide: Exercise, useClass: Exercise, deps: [ApiService] },
  {
    provide: ExerciseAssociation,
    useClass: ExerciseAssociation,
    deps: [ApiService]
  },
  { provide: ExerciseType, useClass: ExerciseType, deps: [ApiService] },
  { provide: Feedback, useClass: Feedback, deps: [ApiService] },
  { provide: FileVault, useClass: FileVault, deps: [ApiService] },
  { provide: Food, useClass: Food, deps: [ApiService] },
  { provide: FoodV2, useClass: FoodV2, deps: [ApiService] },
  { provide: FoodConsumed, useClass: FoodConsumed, deps: [ApiService] },
  { provide: FoodFavorite, useClass: FoodFavorite, deps: [ApiService] },
  { provide: FoodIngredient, useClass: FoodIngredient, deps: [ApiService] },
  { provide: FoodMeal, useClass: FoodMeal, deps: [ApiService] },
  {
    provide: FoodMealOrganization,
    useClass: FoodMealOrganization,
    deps: [ApiService]
  },
  { provide: FoodMealServing, useClass: FoodMealServing, deps: [ApiService] },
  { provide: FoodPreference, useClass: FoodPreference, deps: [ApiService] },
  { provide: FoodServing, useClass: FoodServing, deps: [ApiService] },
  { provide: FoodKey, useClass: FoodKey, deps: [ApiService] },
  { provide: Form, useClass: Form, deps: [ApiService] },
  { provide: FormAddendum, useClass: FormAddendum, deps: [ApiService] },
  { provide: FormQuestion, useClass: FormQuestion, deps: [ApiService] },
  { provide: FormQuestionType, useClass: FormQuestionType, deps: [ApiService] },
  {
    provide: FormSection,
    useClass: FormSection,
    deps: [ApiService]
  },
  { provide: FormSubmission, useClass: FormSubmission, deps: [ApiService] },
  { provide: GoalV2, useClass: GoalV2, deps: [ApiService] },
  { provide: Hydration, useClass: Hydration, deps: [ApiService] },
  { provide: Idealshape, useClass: Idealshape, deps: [ApiService] },
  { provide: Interaction, useClass: Interaction, deps: [ApiService] },
  { provide: Logging, useClass: Logging, deps: [ApiService] },
  { provide: MALA, useClass: MALA, deps: [ApiService] },
  {
    provide: MeasurementDataPointProvider,
    useClass: MeasurementDataPointProvider,
    deps: [measurementApiService]
  },
  {
    provide: MeasurementDataPointProvider,
    useClass: MeasurementDataPointProvider,
    deps: [ApiService]
  },
  {
    provide: MeasurementDataPointTypeProvider,
    useClass: MeasurementDataPointTypeProvider,
    deps: [ApiService]
  },
  {
    provide: MeasurementPreferenceProvider,
    useClass: MeasurementPreferenceProvider,
    deps: [ApiService]
  },
  {
    provide: MeasurementLabelProvider,
    useClass: MeasurementLabelProvider,
    deps: [ApiService]
  },
  { provide: Messaging, useClass: Messaging, deps: [messagingApiService] },
  {
    provide: MessagingPermission,
    useClass: MessagingPermission,
    deps: [ApiService]
  },
  {
    provide: MessagingPreference,
    useClass: MessagingPreference,
    deps: [ApiService]
  },
  { provide: MFA, useClass: MFA, deps: [ApiService] },
  { provide: MobileApp, useClass: MobileApp, deps: [ApiService] },
  { provide: Notification, useClass: Notification, deps: [ApiService] },
  {
    provide: OrganizationProvider,
    useClass: OrganizationProvider,
    deps: [ApiService]
  },
  {
    provide: OrganizationAssignment,
    useClass: OrganizationAssignment,
    deps: [ApiService]
  },
  {
    provide: OrganizationAssociation,
    useClass: OrganizationAssociation,
    deps: [ApiService]
  },
  {
    provide: OrganizationPreference,
    useClass: OrganizationPreference,
    deps: [ApiService]
  },
  { provide: Package, useClass: Package, deps: [ApiService] },
  {
    provide: PackageEnrollment,
    useClass: PackageEnrollment,
    deps: [ApiService]
  },
  {
    provide: PackageOrganization,
    useClass: PackageOrganization,
    deps: [ApiService]
  },
  { provide: Phase, useClass: Phase, deps: [ApiService] },
  { provide: Register, useClass: Register, deps: [ApiService] },
  { provide: Reports, useClass: Reports, deps: [ApiService] },
  { provide: RPM, useClass: RPM, deps: [ApiService] },
  { provide: Schedule, useClass: Schedule, deps: [ApiService] },
  { provide: Sequence, useClass: Sequence, deps: [ApiService] },
  { provide: Session, useClass: Session, deps: [ApiService] },
  { provide: SpreeProvider, useClass: SpreeProvider, deps: [ApiService] },
  { provide: Supplement, useClass: Supplement, deps: [ApiService] },
  { provide: Task, useClass: Task, deps: [ApiService] },
  { provide: Timezone, useClass: Timezone, deps: [ApiService] },
  { provide: User, useClass: User, deps: [ApiService] },
  { provide: Zendesk, useClass: Zendesk, deps: [ApiService] }
]
