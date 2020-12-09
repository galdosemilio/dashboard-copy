import { SidenavOptions } from '../consts'
import { SectionConfigDetails } from '../models/section.details'

export const FullyAliveTestSectionConfig: SectionConfigDetails = {
  SIDENAV: {
    HIDDEN_OPTIONS: [SidenavOptions.STORE, SidenavOptions.REPORT_CUSTOM]
  }
}

export const FullyAliveProdSectionConfig: SectionConfigDetails = {
  SIDENAV: {
    HIDDEN_OPTIONS: [SidenavOptions.STORE, SidenavOptions.REPORT_CUSTOM]
  }
}
