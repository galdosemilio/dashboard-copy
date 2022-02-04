import { AccountIdentifiersComponent } from '@app/dashboard/accounts/dieters/form/account-identifiers/account-identifiers.component'
import { DefaultLayoutComponent } from '@app/layout/layouts'
import { PackageEnrollComponent } from '@app/shared/components/package-enroll/package-enroll.component'
import {
  CompositionColumns,
  JournalTabs,
  SettingsTabs,
  SidenavOptions
} from './consts'
import { SectionConfigDetails } from './models/section.details'
import { DefaultDashboardComponent } from '@app/dashboard/panel'
import { AccountIdentifiersProps } from '@app/shared/model/accountIdentifiers/account-identifiers.props'
import { _ } from '@app/shared/utils'
import { DefaultProfileComponent } from '@app/dashboard/profile/layouts'
import { environment } from '../../../environments/environment'

export const DefaultTestSectionConfig: SectionConfigDetails = {
  CLINIC_LISTING: {
    SHOW_CLINIC_CREATE_BUTTON: false,
    SHOW_CLINIC_CREATE_BUTTON_DIRECT: false
  },
  JOURNAL: {
    ALLOW_MEASUREMENT_LIST_VIEW: false,
    HIDDEN_COMPOSITION_COLUMNS: [CompositionColumns.KETONES],
    ADDITIONAL_VITALS_COLUMNS: [],
    HIDDEN_MEASUREMENT_TABS: [],
    HIDDEN_SETTINGS_TABS: [SettingsTabs.PHASE_HISTORY],
    HIDDEN_TABS: [JournalTabs.METRICS],
    PHYSICIAN_FORM: environment.physicianFormId,
    SHOW_DOCTOR_PDF_BUTTON: false,
    SHOW_PATIENT_PDF_BUTTON: false,
    SHOW_FOOD_MOOD_AND_NOTE: false
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
    UNENROLL_THEN_ENROLL: false,
    DISABLE_EDIT_BILLING_ADDRESS: false
  },
  PATIENT_LISTING: {
    SHOW_PATIENT_CREATE_BUTTON: true,
    ADDITIONAL_LISTING_COLUMNS: []
  },
  RIGHT_PANEL: {
    DAYSHEETS_FORM: environment.daysheetsFormId,
    SHOW_DAYSHEET_BUTTON: false,
    SHOW_REMINDERS: true,
    REMINDERS_FORM: environment.remindersFormId
  },
  SIDENAV: {
    HIDDEN_OPTIONS: [SidenavOptions.REPORT_CUSTOM],
    PATIENT_HIDDEN_OPTIONS: [SidenavOptions.TEST_RESULTS, SidenavOptions.STORE],
    PATIENT_SHOWN_OPTIONS: [],
    FETCH_STORE_LINK: false,
    STORE_NAV_NAME: _('SIDENAV.STORE')
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
  },
  PATIENT_DASHBOARD: {
    SHOW_MY_SCHEDULE: false,
    SHOW_NEW_APPOINTMENT: false,
    ALLOWED_CHART_DATA_POINT_TYPES: null
  },
  GLOBAL: {
    DASHBOARD: {
      component: DefaultDashboardComponent
    },
    LAYOUT: {
      component: DefaultLayoutComponent
    },
    LOGIN_SITE_URL: 'https://test.dashboard.coachcare.com',
    PROFILE: {
      component: DefaultProfileComponent
    }
  },
  PROVIDER_PROFILE: {
    SHOW_PHASE_LISTING: false
  },
  DIGITAL_LIBRARY: {
    EXTERNAL_VISIBILITY_OPTIONS_ENABLED: false
  },
  COMMUNICATIONS: {
    ENABLE_CALL_BACKGROUNDS: false
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
    ADDITIONAL_VITALS_COLUMNS: [],
    HIDDEN_MEASUREMENT_TABS: [],
    HIDDEN_SETTINGS_TABS: [SettingsTabs.PHASE_HISTORY],
    HIDDEN_TABS: [JournalTabs.METRICS],
    PHYSICIAN_FORM: environment.physicianFormId,
    SHOW_DOCTOR_PDF_BUTTON: false,
    SHOW_PATIENT_PDF_BUTTON: false,
    SHOW_FOOD_MOOD_AND_NOTE: false
  },
  PATIENT_FORM: {
    PACKAGE_ENROLL: {
      component: PackageEnrollComponent
    },
    UNENROLL_THEN_ENROLL: false,
    DISABLE_EDIT_BILLING_ADDRESS: false
  },
  PATIENT_LISTING: {
    SHOW_PATIENT_CREATE_BUTTON: true,
    ADDITIONAL_LISTING_COLUMNS: []
  },
  RIGHT_PANEL: {
    DAYSHEETS_FORM: environment.daysheetsFormId,
    SHOW_DAYSHEET_BUTTON: false,
    SHOW_REMINDERS: true,
    REMINDERS_FORM: environment.remindersFormId
  },
  SIDENAV: {
    HIDDEN_OPTIONS: [SidenavOptions.REPORT_CUSTOM],
    PATIENT_HIDDEN_OPTIONS: [SidenavOptions.TEST_RESULTS, SidenavOptions.STORE],
    PATIENT_SHOWN_OPTIONS: [],
    FETCH_STORE_LINK: false,
    STORE_NAV_NAME: _('SIDENAV.STORE')
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
  },
  PATIENT_DASHBOARD: {
    SHOW_MY_SCHEDULE: false,
    SHOW_NEW_APPOINTMENT: false,
    ALLOWED_CHART_DATA_POINT_TYPES: null
  },
  GLOBAL: {
    DASHBOARD: {
      component: DefaultDashboardComponent
    },
    LAYOUT: {
      component: DefaultLayoutComponent
    },
    LOGIN_SITE_URL: 'https://dashboard.coachcare.com',
    PROFILE: {
      component: DefaultProfileComponent
    }
  },
  PROVIDER_PROFILE: {
    SHOW_PHASE_LISTING: false
  },
  DIGITAL_LIBRARY: {
    EXTERNAL_VISIBILITY_OPTIONS_ENABLED: false
  },
  COMMUNICATIONS: {
    ENABLE_CALL_BACKGROUNDS: false
  }
}
