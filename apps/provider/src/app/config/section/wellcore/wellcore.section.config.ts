import { SidenavOptions } from '../consts'
import { SectionConfigDetails } from '../models/section.details'

export const WellCoreProdSectionConfig: SectionConfigDetails = {
  SIDENAV: {
    PATIENT_SHOWN_OPTIONS: [SidenavOptions.TEST_RESULTS]
  },
  PATIENT_DASHBOARD: {
    SHOW_MY_SCHEDULE: true,
    SHOW_NEW_APPOINTMENT: false
  }
}

export const WellCoreTestSectionConfig: SectionConfigDetails = {
  SIDENAV: {
    PATIENT_SHOWN_OPTIONS: [SidenavOptions.TEST_RESULTS]
  },
  PATIENT_DASHBOARD: {
    SHOW_MY_SCHEDULE: true,
    SHOW_NEW_APPOINTMENT: false
  }
}
