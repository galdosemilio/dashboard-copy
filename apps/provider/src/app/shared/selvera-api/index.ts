export * from './message';
export * from './units';

export {
  ConnectionStats,
  ConnectionStatus
} from 'selvera-api/dist/lib/selvera-api/processors/twilio/model';

export {
  ResetPasswordRequest,
  UpdatePasswordRequest
} from 'selvera-api/dist/lib/selvera-api/providers/access/requests';

export * from 'selvera-api/dist/lib/selvera-api/providers/identifier/account/entities';
export * from 'selvera-api/dist/lib/selvera-api/providers/identifier/account/requests';
export * from 'selvera-api/dist/lib/selvera-api/providers/identifier/account/responses';

export {
  AccAccesibleSort,
  AccSort,
  AccountMeasurementPreferenceType,
  AccountTypeTitle,
  AccountTypeId,
  AccountTypeIds,
  AccountTypeInfo,
  Gender,
  genders,
  ClientData,
  PhoneType,
  AccountCoreData,
  Account,
  AccountAccessOrganization,
  AccountFullData,
  AccountAccessData,
  AccountPreferences,
  AccountPreferenceType,
  AccSortProperties,
  accSortProperties,
  LoginHistoryItem
} from 'selvera-api/dist/lib/selvera-api/providers/account/entities';
export {
  AccActivityRequest,
  AccAddRequest,
  AccCheckRequest,
  AccListAllRequest,
  AccListRequest,
  AccPreferencesRequest,
  AccUpdateRequest,
  AvatarSubmitRequest,
  GetLoginHistoryRequest
} from 'selvera-api/dist/lib/selvera-api/providers/account/requests';
export {
  AccAddResponse,
  AccListAllResponse,
  AccListResponse,
  AccPreferencesResponse,
  AccSingleResponse,
  FetchAllAccountObjectResponse
} from 'selvera-api/dist/lib/selvera-api/providers/account/responses';

export { AffiliationPermissions } from 'selvera-api/dist/lib/selvera-api/providers/affiliation/entities';
export {
  AssignmentRequest,
  AssociationRequest,
  RemoveAssociationRequest,
  UpdateAssociationRequest
} from 'selvera-api/dist/lib/selvera-api/providers/affiliation/requests';

export * from 'selvera-api/dist/lib/selvera-api/providers/alerts/entities';
export * from 'selvera-api/dist/lib/selvera-api/providers/alerts/requests';
export * from 'selvera-api/dist/lib/selvera-api/providers/alerts/responses';

export * from 'selvera-api/dist/lib/selvera-api/providers/authentication/entities';
export * from 'selvera-api/dist/lib/selvera-api/providers/authentication/requests';
export * from 'selvera-api/dist/lib/selvera-api/providers/authentication/responses';

export * from 'selvera-api/dist/lib/selvera-api/providers/communication/requests';
export * from 'selvera-api/dist/lib/selvera-api/providers/communication/entities';
export * from 'selvera-api/dist/lib/selvera-api/providers/communication';

export * from 'selvera-api/dist/lib/selvera-api/providers/ccr/register/requests';
export * from 'selvera-api/dist/lib/selvera-api/providers/ccr/register/responses';

export {
  CallAborted,
  CallDeclined,
  Organization as CallOrganization,
  Participant as CallParticipant,
  Room
} from 'selvera-api/dist/lib/selvera-api/providers/conference/models';
export {
  CreateCallRequest,
  CreateSubaccountRequest,
  FetchAllSubaccountsRequest,
  FetchAvailabilityRequest,
  FetchCallAvailabilityRequest,
  FetchCallDetailsRequest,
  FetchCallsRequest,
  NotifyCallEventRequest,
  UpdateCallRequest,
  VideoTokenRequest
} from 'selvera-api/dist/lib/selvera-api/providers/conference/requests';
export {
  Call,
  CreateCallResponse,
  FetchAllSubaccountsResponse,
  FetchCallAvailabilityResponse,
  FetchCallDetailsResponse,
  FetchCallsResponse,
  FetchSubaccountResponse,
  Subaccount,
  VideoTokenResponse
} from 'selvera-api/dist/lib/selvera-api/providers/conference/responses';

export {
  ConsultationCreateRequest,
  ConsultationListingRequest
} from 'selvera-api/dist/lib/selvera-api/providers/consultation/requests';
export {
  ConsultationListingResponse,
  ConsultationResponse
} from 'selvera-api/dist/lib/selvera-api/providers/consultation/responses';

export {
  ContentOrganization,
  ContentPreferenceSingle,
  ContentType,
  ContentSort,
  PagedResponse
} from 'selvera-api/dist/lib/selvera-api/providers/content/entities';
export {
  CopyContentRequest,
  CreateContentRequest,
  CreateContentPackageRequest,
  CreateVaultContentRequest,
  DeleteContentPackageRequest,
  GetAllContentRequest,
  GetAllVaultContentRequest,
  GetListContentRequest,
  GetUploadUrlContentRequest,
  UpdateContentRequest
} from 'selvera-api/dist/lib/selvera-api/providers/content/requests';
export {
  ContentSingle,
  GetAllContentResponse,
  GetAllContentPackageResponse,
  GetAllVaultContentResponse,
  GetListContentResponse,
  GetTypesContentResponse,
  GetUploadUrlContentResponse
} from 'selvera-api/dist/lib/selvera-api/providers/content/responses';

export * from 'selvera-api/dist/lib/selvera-api/providers/country/entities';

export {
  ExerciseType,
  PaginationResponse
} from 'selvera-api/dist/lib/selvera-api/providers/exercise/entities';
export {
  CreateExerciseRequest,
  CreateExerciseAssociationRequest,
  CreateExerciseTypeRequest,
  GetAllExerciseRequest,
  GetAllExerciseAssociationRequest,
  GetAllExerciseTypeRequest,
  UpdateExerciseAssociationRequest,
  UpdateExerciseTypeRequest
} from 'selvera-api/dist/lib/selvera-api/providers/exercise/requests';
export {
  GetAllExerciseResponse,
  GetAllExerciseAssociationResponse,
  GetAllExerciseTypeResponse,
  GetSingleExerciseResponse,
  GetSingleExerciseAssociationResponse,
  GetSingleExerciseTypeResponse
} from 'selvera-api/dist/lib/selvera-api/providers/exercise/responses';

export {
  Entity,
  NamedEntity,
  KeyDataEntity,
  KeyDataEntryActive,
  KeyDataEntry,
  AccountKeyEntryEntity
} from 'selvera-api/dist/lib/selvera-api/providers/foodKey/entities';
export {
  AddAccountKeyRequest,
  AddConsumedKeyRequest,
  AddKeyRequest,
  AddOrganizationKeyRequest,
  FetchAllAccountKeyRequest,
  FetchAllConsumedKeyRequest,
  FetchAllKeyRequest,
  FetchAllOrganizationKeyRequest,
  UpdateAccountKeyRequest,
  UpdateConsumedKeyRequest,
  UpdateKeyRequest,
  UpdateOrganizationKeyRequest
} from 'selvera-api/dist/lib/selvera-api/providers/foodKey/requests';
export {
  AddResponse,
  ConsumedKeyResponse,
  FetchAllConsumedKeyResponse,
  FetchAllKeyResponse,
  FetchAllOrganizationKeyResponse,
  FetchSingleAccountKeyResponse,
  FetchSingleOrganizationKeyResponse
} from 'selvera-api/dist/lib/selvera-api/providers/foodKey/responses';

export {
  EntityWithDescription,
  Ingredient,
  Meal,
  MealPlanItem,
  MealPlan
} from 'selvera-api/dist/lib/selvera-api/providers/food/entities';
export {
  AddConsumedRequest,
  AddFavoriteMealRequest,
  AddMealRequest,
  DeleteFavoriteMealRequest,
  FetchAllConsumedRequest,
  FetchAllFoodRequest,
  FetchAllMealRequest,
  FetchFavoriteMealsRequest,
  FetchSingleIngredientRequest,
  SummaryDataOption as FoodSummaryData,
  FetchSummaryRequest as FetchFoodSummaryRequest,
  IngredientRequest
} from 'selvera-api/dist/lib/selvera-api/providers/food/requests';
export {
  AddConsumedMealResponse,
  AddMealResponse,
  DetailedIngredientResponse,
  FetchAllConsumedMealIngredients,
  FetchAllSingleConsumedMealResponse,
  FetchAllConsumedResponse,
  FetchAllFoodResponse,
  FetchAllMealResponse,
  FetchFavoriteMealResponse,
  GenericFoodResponse,
  LocalFoodResponse,
  NaturalFoodResponse,
  FetchSingleConsumedMealResponse,
  FetchSingleIngredientResponse,
  FetchSingleMealResponse,
  IngredientMeasurementResponse,
  SummaryDataResponse as FoodSummaryDataResponseSegment,
  SummaryDataResponseNutrient,
  SummaryDataResponseUnfiltered,
  UnderscoreDetailedIngredientResponse
} from 'selvera-api/dist/lib/selvera-api/providers/food/responses';

export * from 'selvera-api/dist/lib/selvera-api/providers/food2/requests';
export * from 'selvera-api/dist/lib/selvera-api/providers/food2/responses';

export * from 'selvera-api/dist/lib/selvera-api/providers/form/entities';
export * from 'selvera-api/dist/lib/selvera-api/providers/form/requests';
export * from 'selvera-api/dist/lib/selvera-api/providers/form/responses';

export {
  FetchGoalRequest,
  UpdateGoalRequest
} from 'selvera-api/dist/lib/selvera-api/providers/goal/requests';
export { FetchGoalResponse } from 'selvera-api/dist/lib/selvera-api/providers/goal/responses';

export {
  AddHydrationRequest,
  DeleteHydrationRequest,
  GetHydrationRequest,
  GetHydrationSummaryRequest,
  UpdateHydrationRequest
} from 'selvera-api/dist/lib/selvera-api/providers/hydration/requests';
export {
  HydrationResponse,
  HydrationSummaryResponse
} from 'selvera-api/dist/lib/selvera-api/providers/hydration/responses';

export { AddLogRequest } from 'selvera-api/dist/lib/selvera-api/providers/logging/requests';

export {
  ActivitySummaryData,
  ActivitySummaryUnit,
  AddActivityRequest,
  DeleteActivityRequest,
  FetchActivityRequest,
  FetchActivitySummaryRequest
} from 'selvera-api/dist/lib/selvera-api/providers/measurement/activity/requests';
export {
  FetchActivityResponse,
  FetchActivitySummaryResponse,
  SummaryActivityResponseSegment
} from 'selvera-api/dist/lib/selvera-api/providers/measurement/activity/responses';
export {
  AddBodyMeasurementRequest,
  BodySummaryData,
  BodySummaryUnit,
  FetchBodySummaryRequest,
  FetchBodyMeasurementRequest,
  FetchBodyMeasurementRequestV1
} from 'selvera-api/dist/lib/selvera-api/providers/measurement/body/requests';
export {
  BodySummaryDataResponseSegment,
  FetchBodySummaryResponse,
  FetchBodyMeasurementResponse
} from 'selvera-api/dist/lib/selvera-api/providers/measurement/body/responses';
export { FetchBodyMeasurementDataResponse } from 'selvera-api/dist/lib/selvera-api/providers/measurement/body/responses/fetchBodyMeasurementDataResponse.interface';
export {
  AddManualSleepMeasurementRequest,
  AddSleepMeasurementRequest,
  FetchSleepMeasurementSummaryRequest,
  FetchSleepMeasurementRequest,
  SleepSummaryData,
  SleepSummaryUnit
} from 'selvera-api/dist/lib/selvera-api/providers/measurement/sleep/requests';
export {
  FetchSleepMeasurementResponse,
  FetchSleepMeasurementSummaryResponse,
  SummarySleepMeasurementResponseSegment
} from 'selvera-api/dist/lib/selvera-api/providers/measurement/sleep/responses';

export * from 'selvera-api/dist/lib/selvera-api/providers/messaging/entities';
export * from 'selvera-api/dist/lib/selvera-api/providers/messaging/requests';
export * from 'selvera-api/dist/lib/selvera-api/providers/messaging/responses';

export * from 'selvera-api/dist/lib/selvera-api/providers/mfa/requests';
export * from 'selvera-api/dist/lib/selvera-api/providers/mfa/responses';

export {
  AppRedirectRequest,
  FetchAppleIdRequest
} from 'selvera-api/dist/lib/selvera-api/providers/mobileApp/requests';
export {
  AppRedirectResponse,
  AppStoreLookupResponse
} from 'selvera-api/dist/lib/selvera-api/providers/mobileApp/responses';

export {
  AddConsultationNoteRequest,
  AddNoteRequest,
  FetchAllConsultationNotesRequest,
  FetchAllNotesRequest,
  UpdateConsultationNoteRequest,
  UpdateNoteRequest
} from 'selvera-api/dist/lib/selvera-api/providers/notes/requests';
export {
  FetchAllConsultationNotesResponse,
  FetchAllNotesResponse,
  FetchConsultationNoteResponse,
  FetchNoteResponse
} from 'selvera-api/dist/lib/selvera-api/providers/notes/responses';

export * from 'selvera-api/dist/lib/selvera-api/providers/organization/entities';
export * from 'selvera-api/dist/lib/selvera-api/providers/organization/requests';
export * from 'selvera-api/dist/lib/selvera-api/providers/organization/responses';

export * from 'selvera-api/dist/lib/selvera-api/providers/pain/entities';
export * from 'selvera-api/dist/lib/selvera-api/providers/pain/requests';
export * from 'selvera-api/dist/lib/selvera-api/providers/pain/responses';

export * from 'selvera-api/dist/lib/selvera-api/providers/package/requests';
export * from 'selvera-api/dist/lib/selvera-api/providers/package/responses';
export * from 'selvera-api/dist/lib/selvera-api/providers/package/entities';

export {
  CreateEnrollmentsRequest,
  CreatePackageRequest,
  FetchEnrollmentsRequest,
  FetchPackagesRequest,
  UpdatePackageRequest
} from 'selvera-api/dist/lib/selvera-api/providers/phase/requests';
export {
  Enrollment,
  EnrollmentUnfiltered,
  FetchEnrollmentResponse,
  FetchEnrollmentsResponse,
  FetchEnrollmentsUnfiltered,
  FetchPackageResponse,
  FetchPackagesResponse,
  FetchPackagesSegment,
  FetchPackagesUnfiltered,
  FetchPhaseResponse,
  InsertResponse
} from 'selvera-api/dist/lib/selvera-api/providers/phase/responses';

export {
  ReportAccount,
  ActivityLevelSort,
  AggregateLevel,
  Bucket,
  BucketSegment,
  ReportClients,
  CountedPaginatedResponse,
  CreationTimestamp,
  GenderBreakdown,
  HoursSlept,
  ReportPackage,
  PatientListingItem,
  ProviderCountAggregate,
  Registrations,
  ReportProviders,
  ReportSort,
  SleepReportSegment,
  SignupsListSort,
  Steps,
  TimelineSegment,
  TimelineUnit,
  SummaryUnit,
  WeightChange,
  WeightChangeSegment
} from 'selvera-api/dist/lib/selvera-api/providers/reports/entities';
export {
  ActivityLevelRequest,
  AgeDemographicsRequest,
  DemographicsRequest,
  EnrollmentSimpleReportRequest,
  EnrollmentSnapshotRequest,
  EnrollmentTimelineRequest,
  GenderDemographicsRequest,
  FetchRPMBillingSummaryRequest,
  OrganizationActivityRequest,
  PatientCountRequest,
  FetchPatientListingRequest,
  ProviderCountRequest,
  SignupsListRequest,
  SignupsSnapshotRequest,
  SignupsTimelineRequest,
  SleepReportRequest,
  WeightChangeRequest
} from 'selvera-api/dist/lib/selvera-api/providers/reports/requests';
export {
  AccountData,
  ActiveRPMItem,
  ActivityLevelSegment,
  AgeDemographicsSegment,
  EnrollmentAggregate,
  EnrollmentSimpleReportResponse,
  EnrollmentSnapshotSegment,
  EnrollmentTimelineSegment,
  FetchRPMBillingSummaryResponse,
  GenderDemographicsSegment,
  InactiveRPMItem,
  OrganizationActivityAggregate,
  OrganizationActivityResponse,
  PatientCountSegment,
  ProviderCountSegment,
  RPMStateSummaryBillingItem,
  RPMStateSummaryItem,
  SignupsAggregate,
  SignupsListResponse,
  SignupsListSegment,
  SignupsSnapshotSegment,
  SignupsTimelineSegment,
  SleepReportResponse,
  TimelineEnrollments,
  WeightChangeResponse
} from 'selvera-api/dist/lib/selvera-api/providers/reports/responses';

export {
  CreateRPMStateRequest,
  GetListRequest,
  GetAuditListRequest,
  GetRPMPreferenceByOrgRequest
} from 'selvera-api/dist/lib/selvera-api/providers/rpm/requests';

export * from 'selvera-api/dist/lib/selvera-api/providers/rpm/entities';

export {
  RPMState,
  RPMStateConditions
} from 'selvera-api/dist/lib/selvera-api/providers/rpm/entities';

export {
  DeviceTypeId,
  DeviceTypeIds
} from 'selvera-api/dist/lib/selvera-api/providers/session/entities';
export { SessionRequest } from 'selvera-api/dist/lib/selvera-api/providers/session/requests';
export { SessionResponse } from 'selvera-api/dist/lib/selvera-api/providers/session/responses';

export {
  AccountTimezone,
  MeetingAttendee,
  MeetingType,
  MeetingLocation,
  MeetingLocationRequest,
  AttendanceStatusAssociation,
  AttendanceStatusEntry
} from 'selvera-api/dist/lib/selvera-api/providers/schedule/entities';
export {
  AddAttendeeRequest,
  AddMeetingRequest,
  AddMeetingTypeAssociationRequest,
  AddMeetingTypeRequest,
  AddRecurrentAvailabilityRequest,
  AddSingleAvailabilityRequest,
  DeleteRecurringMeetingRequest,
  FetchAllMeetingRequest,
  FetchCalendarAvailabilityRequest,
  FetchProviderAvailabilityRequest,
  FetchSummaryRequest,
  SearchProviderAvailabilityRequest,
  SetTimezoneRequest,
  UpdateAttendanceRequest,
  UpdateMeetingRequest,
  UpdateMeetingTypeRequest
} from 'selvera-api/dist/lib/selvera-api/providers/schedule/requests';
export {
  AddMeetingResponse,
  AddRecurrentAvailabilityResponse,
  AddSingleAvailabilityResponse,
  FetchAllMeetingResponse,
  FetchAvailabilityResponse,
  FetchCalendarAvailabilityResponse,
  FetchCalendarAvailabilitySegment,
  FetchMeetingResponse,
  FetchMeetingTypesResponse,
  FetchProviderAvailabilitySegment,
  FetchRecurrentAvailabilitySegment,
  FetchSummaryResponse,
  SearchProviderAvailabilityResponse
} from 'selvera-api/dist/lib/selvera-api/providers/schedule/responses';

export {
  AddConsumptionRequest,
  AddSupplementAccountAssociationRequest,
  AddSupplementAssociationRequest,
  AddSupplementRequest,
  FetchAllConsumptionRequest,
  FetchSupplementAccountAssociationRequest,
  FetchSupplementSummaryRequest,
  SearchSupplementsRequest,
  UpdateConsumptionRequest,
  UpdateSupplementAccountAssociationRequest,
  UpdateSupplementAssociationRequest,
  UpdateSupplementRequest
} from 'selvera-api/dist/lib/selvera-api/providers/supplement/requests';
export {
  AddConsumptionResponse,
  AddSupplementAccountAssociationResponse,
  AddSupplementAssociationResponse,
  AddSupplementResponse,
  FetchAllConsumptionResponse,
  FetchAllConsumptionSegment,
  FetchSupplementAccountAssociationResponse,
  FetchSupplementAssociationResponse,
  FetchSupplementsResponse,
  FetchSupplementsSegment,
  FetchSupplementSummaryResponse,
  OrganizationSupplements,
  SearchSupplementsResponse,
  SupplementDataResponseSegment
} from 'selvera-api/dist/lib/selvera-api/providers/supplement/responses';

export { TimezoneResponse } from 'selvera-api/dist/lib/selvera-api/providers/timezone/responses';

export {
  Profile,
  AccountType,
  DeviceType,
  LoginRequest
} from 'selvera-api/dist/lib/selvera-api/providers/user/requests';
export { LoginResponse } from 'selvera-api/dist/lib/selvera-api/providers/user/responses';

export * from 'selvera-api/dist/lib/selvera-api/providers/sequence/requests';
export * from 'selvera-api/dist/lib/selvera-api/providers/sequence/responses';
export * from 'selvera-api/dist/lib/selvera-api/providers/sequence/entities';

export * from 'selvera-api/dist/lib/selvera-api/providers/zendesk/entities';

export * from 'selvera-api/dist/lib/selvera-api/providers/interaction/requests';
export * from 'selvera-api/dist/lib/selvera-api/providers/interaction/responses';
export * from 'selvera-api/dist/lib/selvera-api/providers/interaction/entities';

/**
 * API interfaces.
 */
export interface APISummaryResponse {
  data: Array<any>;
  summary: { [data: string]: any };
}

/**
 * Required mapping of type possible values.
 * https://github.com/Microsoft/TypeScript/issues/17061
 */
export const BodySummaryValues = [
  'acetonePpm',
  'weight',
  'bmi',
  'fatFreeMass',
  'bodyFat',
  'fatMassWeight',
  'bloodPressureDiastolic',
  'bloodPressureSystolic',
  'heartRate',
  'bloodOxygenLevel',
  'boneWeight',
  'basalMetabolicRate',
  'musclePercentage',
  'visceralFatPercentage',
  'visceralFatTanita',
  'waterPercentage',
  'waist',
  'arm',
  'hip',
  'chest',
  'thigh',
  'neck',
  'thorax',
  'totalCholesterol',
  'ldl',
  'hdl',
  'vldl',
  'triglycerides',
  'fastingGlucose',
  'hba1c',
  'insulin',
  'hsCrp',
  'temperature',
  'respirationRate'
];

export const ActivitySummaryValues = ['steps', 'distance', 'calories', 'elevation'];

export const SleepSummaryValues = ['total', 'average', 'sleepQuality'];

export const FoodSummaryValues = [
  'calories',
  'protein',
  'carbohydrates',
  'fiber',
  'sugar',
  'potassium',
  'sodium',
  'totalFat',
  'saturatedFat',
  'cholesterol'
];
