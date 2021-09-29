import { SidenavOptions } from '../consts'
import { SectionConfigDetails } from '../models/section.details'

export const MuscleWiseSectionConfig: SectionConfigDetails = {
  SIDENAV: {
    HIDDEN_OPTIONS: [SidenavOptions.REPORT_CUSTOM],
    PATIENT_HIDDEN_OPTIONS: [SidenavOptions.TEST_RESULTS],
    PATIENT_SHOWN_OPTIONS: [SidenavOptions.STORE],
    FETCH_STORE_LINK: true
  }
}
