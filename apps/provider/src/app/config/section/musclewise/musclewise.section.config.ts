import { _ } from '@app/shared/utils'
import { SidenavOptions } from '../consts'
import { SectionConfigDetails } from '../models/section.details'

export const MuscleWiseSectionConfig: SectionConfigDetails = {
  SIDENAV: {
    HIDDEN_OPTIONS: [
      SidenavOptions.REPORT_CUSTOM,
      SidenavOptions.STORE_COACHCARE
    ],
    PATIENT_HIDDEN_OPTIONS: [SidenavOptions.TEST_RESULTS],
    STORE_CLINIC_USES_SHOPIFY: true,
    STORE_CLINIC_NAV_NAME: _('SIDENAV.MANAGE_MY_SUBSCRIPTION')
  },
  COMMUNICATIONS: {
    ENABLE_CALL_BACKGROUNDS: true,
    CALL_BACKGROUND_URL: 'assets/img/musclewise/musclewisebackground.jpeg'
  }
}
