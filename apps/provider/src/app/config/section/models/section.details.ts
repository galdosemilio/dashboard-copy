import {
  ClinicListingConfigDetails,
  JournalConfigDetails,
  PatientFormConfigDetails,
  PatientListingConfigDetails,
  RightPanelDetails,
  SidenavDetails
} from './';

export interface SectionConfigDetails {
  CLINIC_LISTING?: ClinicListingConfigDetails;
  JOURNAL?: JournalConfigDetails;
  PATIENT_FORM?: PatientFormConfigDetails;
  PATIENT_LISTING?: PatientListingConfigDetails;
  RIGHT_PANEL?: RightPanelDetails;
  SIDENAV?: SidenavDetails;
}
