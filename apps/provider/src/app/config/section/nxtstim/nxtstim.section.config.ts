import { MeasurementTabs, SidenavOptions } from '../consts'
import { SectionConfigDetails } from '../models/section.details'

export const NXTSTIMSectionConfig: SectionConfigDetails = {
  JOURNAL: {
    HIDDEN_MEASUREMENT_TABS: [MeasurementTabs.FOOD]
  },
  SIDENAV: {
    HIDDEN_OPTIONS: [SidenavOptions.REPORT_CUSTOM, SidenavOptions.STORE]
  }
}
