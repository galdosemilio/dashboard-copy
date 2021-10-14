import { SidenavOptions } from '../consts'
import { SectionConfigDetails } from '../models/section.details'

export const WellCoreSectionConfig: SectionConfigDetails = {
  SIDENAV: {
    PATIENT_SHOWN_OPTIONS: [SidenavOptions.TEST_RESULTS]
  },
  PATIENT_DASHBOARD: {
    SHOW_MY_SCHEDULE: true,
    SHOW_NEW_APPOINTMENT: false,
    SHOW_MEDICAL_INTAKE_FORM: true
  }
}
