import { _ } from '@app/shared/utils'
import { SidenavOptions } from '../consts'
import { SectionConfigDetails } from '../models/section.details'

export const MuscleWiseSectionConfig: SectionConfigDetails = {
  SIDENAV: {
    HIDDEN_OPTIONS: [SidenavOptions.REPORT_CUSTOM],
    PATIENT_HIDDEN_OPTIONS: [SidenavOptions.TEST_RESULTS],
    PATIENT_SHOWN_OPTIONS: [SidenavOptions.STORE],
    FETCH_STORE_LINK: true,
    STORE_NAV_NAME: _('SIDENAV.MANAGE_MY_SUBSCRIPTION')
  }
}
