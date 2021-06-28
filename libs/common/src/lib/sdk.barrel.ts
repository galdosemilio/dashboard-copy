import {
  ApiService,
  Access,
  AccountIdentifier,
  AccountProvider,
  AccountPreference,
  ActiveCampaign,
  Authentication,
  Affiliation,
  Alerts,
  CCRBlacklist,
  Chart,
  CommunicationPreference,
  Conference,
  Content,
  ContentPackage,
  ContentPreference,
  CountryProvider,
  Device,
  Exercise,
  ExerciseAssociation,
  ExerciseType,
  Feedback,
  FileVault,
  Food,
  FoodV2,
  FoodConsumed,
  FoodFavorite,
  FoodIngredient,
  FoodMeal,
  FoodMealOrganization,
  FoodMealServing,
  FoodPreference,
  FoodServing,
  FoodKey,
  Form,
  FormAddendum,
  FormQuestion,
  FormQuestionType,
  FormSection,
  FormSubmission,
  Goal,
  Hydration,
  Idealshape,
  Interaction,
  Logging,
  MALA,
  MeasurementActivity,
  MeasurementBody,
  MeasurementSleep,
  Messaging,
  MessagingPermission,
  MessagingPreference,
  MFA,
  MobileApp,
  Notification,
  OrganizationProvider,
  OrganizationAssignment,
  OrganizationAssociation,
  Package,
  PackageEnrollment,
  PackageOrganization,
  PainTracking,
  Phase,
  Register,
  Reports,
  RPM,
  Schedule,
  Sequence,
  Session,
  Supplement,
  Timezone,
  User,
  Zendesk,
  AccountPassword,
  OrganizationPreference,
  AccountAvatar,
  AuthenticationToken
} from '@coachcare/sdk'
import { environment } from './environments/environment'

const authenticationToken = new AuthenticationToken()

const generalApiService = new ApiService({
  token: authenticationToken,
  caching: { enabled: false },
  throttling: environment.enableThrottling
    ? { enabled: true, options: { defaultRateLimit: 17 } }
    : { enabled: false }
})

const measurementApiService = new ApiService({
  token: authenticationToken,
  caching: { enabled: false },
  throttling: environment.enableThrottling
    ? {
        enabled: true,
        options: { headers: { enabled: false } }
      }
    : { enabled: false }
})

console.log({ enableThrottling: environment.enableThrottling })

generalApiService.setEnvironment(environment.ccrApiEnv)
measurementApiService.setEnvironment(environment.ccrApiEnv)

export const SdkApiProviders = [
  {
    provide: measurementApiService,
    useValue: measurementApiService
  },
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
  { provide: AccountAvatar, useClass: AccountAvatar, deps: [ApiService] },
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
  { provide: ActiveCampaign, useClass: ActiveCampaign, deps: [ApiService] },
  { provide: Authentication, useClass: Authentication, deps: [ApiService] },
  { provide: Affiliation, useClass: Affiliation, deps: [ApiService] },
  { provide: Alerts, useClass: Alerts, deps: [ApiService] },
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
  { provide: Goal, useClass: Goal, deps: [ApiService] },
  { provide: Hydration, useClass: Hydration, deps: [ApiService] },
  { provide: Idealshape, useClass: Idealshape, deps: [ApiService] },
  { provide: Interaction, useClass: Interaction, deps: [ApiService] },
  { provide: Logging, useClass: Logging, deps: [ApiService] },
  { provide: MALA, useClass: MALA, deps: [ApiService] },
  {
    provide: MeasurementActivity,
    useClass: MeasurementActivity,
    deps: [measurementApiService]
  },
  {
    provide: MeasurementBody,
    useClass: MeasurementBody,
    deps: [measurementApiService]
  },
  {
    provide: MeasurementSleep,
    useClass: MeasurementSleep,
    deps: [measurementApiService]
  },
  { provide: Messaging, useClass: Messaging, deps: [ApiService] },
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
  { provide: PainTracking, useClass: PainTracking, deps: [ApiService] },
  { provide: Phase, useClass: Phase, deps: [ApiService] },
  { provide: Register, useClass: Register, deps: [ApiService] },
  { provide: Reports, useClass: Reports, deps: [ApiService] },
  { provide: RPM, useClass: RPM, deps: [ApiService] },
  { provide: Schedule, useClass: Schedule, deps: [ApiService] },
  { provide: Sequence, useClass: Sequence, deps: [ApiService] },
  { provide: Session, useClass: Session, deps: [ApiService] },
  { provide: Supplement, useClass: Supplement, deps: [ApiService] },
  { provide: Timezone, useClass: Timezone, deps: [ApiService] },
  { provide: User, useClass: User, deps: [ApiService] },
  { provide: Zendesk, useClass: Zendesk, deps: [ApiService] }
]
