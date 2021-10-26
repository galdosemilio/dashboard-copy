import { WellcoreLayoutComponent } from '@app/layout/layouts'
import { WellcoreScheduleListComponent } from '@app/dashboard/schedule/list'
import { SidenavOptions } from '../consts'
import { SectionConfigDetails } from '../models/section.details'

export const WellCoreSectionConfig: SectionConfigDetails = {
  GLOBAL: {
    LAYOUT: {
      component: WellcoreLayoutComponent
    },
    SCHEDULE_LIST: {
      component: WellcoreScheduleListComponent
    }
  },
  SIDENAV: {
    PATIENT_SHOWN_OPTIONS: [SidenavOptions.TEST_RESULTS]
  },
  PATIENT_DASHBOARD: {
    SHOW_MY_SCHEDULE: true,
    SHOW_NEW_APPOINTMENT: true,
    SHOW_MEDICAL_INTAKE_FORM: true
  }
}
