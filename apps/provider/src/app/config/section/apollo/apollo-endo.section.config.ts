import { SidenavOptions } from '../consts'
import { SectionConfigDetails } from '../models/section.details'

export const ApolloEndosurgeryTestSectionConfig: SectionConfigDetails = {
  SIDENAV: {
    HIDDEN_OPTIONS: [SidenavOptions.STORE, SidenavOptions.REPORT_CUSTOM]
  }
}

export const ApolloEndosurgeryProdSectionConfig: SectionConfigDetails = {
  SIDENAV: {
    HIDDEN_OPTIONS: [SidenavOptions.STORE, SidenavOptions.REPORT_CUSTOM]
  }
}
