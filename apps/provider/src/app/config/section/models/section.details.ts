import {
  ClinicListingConfigDetails,
  CommunicationConfigDetails,
  JournalConfigDetails,
  GlobalConfigDetails,
  DigitalLibraryConfigDetails,
  PatientDashboardConfigDetails,
  PatientFormConfigDetails,
  PatientListingConfigDetails,
  RightPanelDetails,
  RPMDetails,
  SidenavDetails,
  CohortReportsDetails,
  ProviderProfileConfigDetails,
  CustomReportsDetails
} from './'

export interface SectionConfigDetails {
  CLINIC_LISTING?: ClinicListingConfigDetails
  COMMUNICATIONS?: CommunicationConfigDetails
  JOURNAL?: JournalConfigDetails
  GLOBAL?: GlobalConfigDetails
  PATIENT_FORM?: PatientFormConfigDetails
  PATIENT_LISTING?: PatientListingConfigDetails
  RIGHT_PANEL?: RightPanelDetails
  RPM?: RPMDetails
  SIDENAV?: SidenavDetails
  COHORT_REPORTS?: CohortReportsDetails
  PATIENT_DASHBOARD?: PatientDashboardConfigDetails
  PROVIDER_PROFILE?: ProviderProfileConfigDetails
  DIGITAL_LIBRARY?: DigitalLibraryConfigDetails
  CUSTOM_REPORTS?: CustomReportsDetails
}
