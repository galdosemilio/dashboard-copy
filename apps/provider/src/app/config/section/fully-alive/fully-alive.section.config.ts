import { SidenavOptions } from '../consts'
import { SectionConfigDetails } from '../models/section.details'

export const FullyAliveTestSectionConfig: SectionConfigDetails = {
  SIDENAV: {
    HIDDEN_OPTIONS: [
      SidenavOptions.STORE_COACHCARE,
      SidenavOptions.REPORT_CUSTOM
    ]
  }
}

export const FullyAliveProdSectionConfig: SectionConfigDetails = {
  SIDENAV: {
    HIDDEN_OPTIONS: [
      SidenavOptions.STORE_COACHCARE,
      SidenavOptions.REPORT_CUSTOM
    ]
  }
}
