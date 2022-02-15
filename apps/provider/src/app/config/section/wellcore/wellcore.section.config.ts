import { WellcoreLayoutComponent } from '@app/layout/layouts'
import { SidenavOptions } from '../consts'
import { SectionConfigDetails } from '../models/section.details'
import { WellcoreDashboardComponent } from '@app/dashboard/panel'
import { PackageEnrollComponent } from '@app/shared/components/package-enroll/package-enroll.component'
import { WellcoreProfileComponent } from '@app/dashboard/profile/layouts'

export const WellCoreTestSectionConfig: SectionConfigDetails = {
  GLOBAL: {
    DASHBOARD: {
      component: WellcoreDashboardComponent
    },
    LAYOUT: {
      component: WellcoreLayoutComponent
    },
    LOGIN_SITE_URL: 'https://test.my.teamwellcore.com/',
    PROFILE: {
      component: WellcoreProfileComponent
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
  },
  DIGITAL_LIBRARY: {
    EXTERNAL_VISIBILITY_OPTIONS_ENABLED: true
  },
  COMMUNICATIONS: {
    ENABLE_CALL_BACKGROUNDS: true,
    CALL_BACKGROUND_URL: 'assets/img/wellcore/wellcorebackground.jpeg'
  }
}

export const WellCoreProdSectionConfig: SectionConfigDetails = {
  GLOBAL: {
    DASHBOARD: {
      component: WellcoreDashboardComponent
    },
    LAYOUT: {
      component: WellcoreLayoutComponent
    },
    LOGIN_SITE_URL: 'https://my.teamwellcore.com/',
    PROFILE: {
      component: WellcoreProfileComponent
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
  },
  DIGITAL_LIBRARY: {
    EXTERNAL_VISIBILITY_OPTIONS_ENABLED: true
  },
  COMMUNICATIONS: {
    ENABLE_CALL_BACKGROUNDS: true,
    CALL_BACKGROUND_URL: 'assets/img/wellcore/wellcorebackground.jpeg'
  }
}
