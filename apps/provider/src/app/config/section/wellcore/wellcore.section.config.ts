import { WellcoreLayoutComponent } from '@app/layout/layouts'
import { SidenavOptions } from '../consts'
import { SectionConfigDetails } from '../models/section.details'
import { WellcoreDashboardComponent } from '@app/dashboard/panel'
import { PackageEnrollComponent } from '@app/shared/components/package-enroll/package-enroll.component'

export const WellCoreSectionConfig: SectionConfigDetails = {
  GLOBAL: {
    DASHBOARD: {
      component: WellcoreDashboardComponent
    },
    LAYOUT: {
      component: WellcoreLayoutComponent
    }
  },
  SIDENAV: {
    PATIENT_SHOWN_OPTIONS: [SidenavOptions.TEST_RESULTS]
  },
  PATIENT_DASHBOARD: {
    SHOW_MY_SCHEDULE: true,
    SHOW_NEW_APPOINTMENT: true
  },
  PROVIDER_PROFILE: {
    SHOW_PHASE_LISTING: true
  },
  PATIENT_LISTING: {
    SHOW_PATIENT_CREATE_BUTTON: false
  },
  PATIENT_FORM: {
    PACKAGE_ENROLL: {
      component: PackageEnrollComponent
    },
    UNENROLL_THEN_ENROLL: false,
    DISABLE_EDIT_BILLING_ADDRESS: true
  }
}
