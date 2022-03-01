import { SidenavOptions } from '../consts'
import { SectionConfigDetails } from '../models/section.details'

export const InhealthSectionConfig: SectionConfigDetails = {
  CLINIC_LISTING: {
    SHOW_CLINIC_CREATE_BUTTON: true
  },
  SIDENAV: {
    SHOWN_OPTIONS: [SidenavOptions.REPORT_CUSTOM]
  }
}
