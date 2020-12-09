import { JournalTabs, SidenavOptions } from '../consts'
import { SectionConfigDetails } from '../models/section.details'

export const LeanMDSectionConfig: SectionConfigDetails = {
  JOURNAL: {
    HIDDEN_TABS: [JournalTabs.EXERCISE, JournalTabs.METRICS]
  },
  PATIENT_FORM: {
    UNENROLL_THEN_ENROLL: true
  },
  SIDENAV: {
    HIDDEN_OPTIONS: [SidenavOptions.STORE, SidenavOptions.REPORT_CUSTOM]
  }
}
