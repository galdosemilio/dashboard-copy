import { SidenavOptions } from '../consts'
import { SectionConfigDetails } from '../models/section.details'

export const WellCoreProdSectionConfig: SectionConfigDetails = {
  SIDENAV: {
    SHOWN_OPTIONS: [SidenavOptions.TEST_RESULTS]
  },
  PATIENT_DASHBOARD: {
    SHOW_MY_SCHEDULE: true
  }
}

export const WellCoreTestSectionConfig: SectionConfigDetails = {
  SIDENAV: {
    SHOWN_OPTIONS: [SidenavOptions.TEST_RESULTS]
  },
  PATIENT_DASHBOARD: {
    SHOW_MY_SCHEDULE: true
  }
}
