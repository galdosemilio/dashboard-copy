import {
  ClinicListingConfigDetails,
  JournalConfigDetails,
  GlobalConfigDetails,
  PatientDashboardConfigDetails,
  PatientFormConfigDetails,
  PatientListingConfigDetails,
  RightPanelDetails,
  RPMDetails,
  SidenavDetails,
  CohortReportsDetails
} from './'

export interface SectionConfigDetails {
  CLINIC_LISTING?: ClinicListingConfigDetails
  JOURNAL?: JournalConfigDetails
  GLOBAL?: GlobalConfigDetails
  PATIENT_FORM?: PatientFormConfigDetails
  PATIENT_LISTING?: PatientListingConfigDetails
  RIGHT_PANEL?: RightPanelDetails
  RPM?: RPMDetails
  SIDENAV?: SidenavDetails
  COHORT_REPORTS?: CohortReportsDetails
  PATIENT_DASHBOARD?: PatientDashboardConfigDetails
}
