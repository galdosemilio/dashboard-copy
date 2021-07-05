import { AccountIdentifiersComponent } from '@app/dashboard/accounts/dieters/form/account-identifiers/account-identifiers.component'
import { AccountIdentifiersProps } from '@app/dashboard/accounts/dieters/form/account-identifiers/models'
import { PackageEnrollComponent } from '@app/shared/components/package-enroll/package-enroll.component'
import { CompositionColumns, JournalTabs, SidenavOptions } from './consts'
import { SectionConfigDetails } from './models/section.details'

export const DefaultTestSectionConfig: SectionConfigDetails = {
  CLINIC_LISTING: {
    SHOW_CLINIC_CREATE_BUTTON: false,
    SHOW_CLINIC_CREATE_BUTTON_DIRECT: false
  },
  JOURNAL: {
    ALLOW_MEASUREMENT_LIST_VIEW: false,
    HIDDEN_COMPOSITION_COLUMNS: [CompositionColumns.KETONES],
    HIDDEN_MEASUREMENT_TABS: [],
    HIDDEN_SETTINGS_TABS: [],
    HIDDEN_TABS: [JournalTabs.METRICS],
    PHYSICIAN_FORM: '15096',
    SHOW_DOCTOR_PDF_BUTTON: false,
    SHOW_PATIENT_PDF_BUTTON: false
  },
  PATIENT_FORM: {
    ACCOUNT_IDENTIFIERS_INPUT: {
      component: AccountIdentifiersComponent,
      props: AccountIdentifiersProps,
      values: {
        identifiers: []
      }
    },
    PACKAGE_ENROLL: {
      component: PackageEnrollComponent
    },
    UNENROLL_THEN_ENROLL: false
  },
  RIGHT_PANEL: {
    DAYSHEETS_FORM: '15121',
    SHOW_DAYSHEET_BUTTON: false,
    SHOW_REMINDERS: true,
    REMINDERS_FORM: '15081'
  },
  SIDENAV: {
    HIDDEN_OPTIONS: [SidenavOptions.REPORT_CUSTOM]
  },
  COHORT_REPORTS: {
    SHOW_COHORT_WEIGHT_LOSS_REPORT: false,
    COHORTS: [
      { days: 7 * 1, gracePeriod: 1 },
      { days: 7 * 2, gracePeriod: 3 },
      { days: 7 * 4, gracePeriod: 4 },
      { days: 7 * 8, gracePeriod: 5 },
      { days: 7 * 12, gracePeriod: 6 },
      { days: 7 * 16, gracePeriod: 7 },
      { days: 7 * 24, gracePeriod: 10 },
      { days: 7 * 52, gracePeriod: 21 }
    ]
  }
}

export const DefaultProdSectionConfig: SectionConfigDetails = {
  CLINIC_LISTING: {
    SHOW_CLINIC_CREATE_BUTTON: false,
    SHOW_CLINIC_CREATE_BUTTON_DIRECT: false
  },
  JOURNAL: {
    ALLOW_MEASUREMENT_LIST_VIEW: false,
    HIDDEN_COMPOSITION_COLUMNS: [CompositionColumns.KETONES],
    HIDDEN_MEASUREMENT_TABS: [],
    HIDDEN_SETTINGS_TABS: [],
    HIDDEN_TABS: [JournalTabs.METRICS],
    PHYSICIAN_FORM: '293',
    SHOW_DOCTOR_PDF_BUTTON: false,
    SHOW_PATIENT_PDF_BUTTON: false
  },
  PATIENT_FORM: {
    PACKAGE_ENROLL: {
      component: PackageEnrollComponent
    },
    UNENROLL_THEN_ENROLL: false
  },
  RIGHT_PANEL: {
    DAYSHEETS_FORM: '238',
    SHOW_DAYSHEET_BUTTON: false,
    SHOW_REMINDERS: true,
    REMINDERS_FORM: '172'
  },
  SIDENAV: {
    HIDDEN_OPTIONS: [SidenavOptions.REPORT_CUSTOM]
  },
  COHORT_REPORTS: {
    SHOW_COHORT_WEIGHT_LOSS_REPORT: false,
    COHORTS: [
      { days: 7 * 1, gracePeriod: 1 },
      { days: 7 * 2, gracePeriod: 3 },
      { days: 7 * 4, gracePeriod: 4 },
      { days: 7 * 8, gracePeriod: 5 },
      { days: 7 * 12, gracePeriod: 6 },
      { days: 7 * 16, gracePeriod: 7 },
      { days: 7 * 24, gracePeriod: 10 },
      { days: 7 * 52, gracePeriod: 21 }
    ]
  }
}
