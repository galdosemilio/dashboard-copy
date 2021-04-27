import { SectionConfigDetails } from '../models/section.details'

export const IdealYouTestSectionConfig: SectionConfigDetails = {
  COHORT_REPORTS: {
    SHOW_COHORT_WEIGHT_LOSS_REPORT: true,
    COHORTS: [
      { days: 10, gracePeriod: 2 },
      { days: 20, gracePeriod: 3 },
      { days: 30, gracePeriod: 5 },
      { days: 40, gracePeriod: 6 }
    ]
  }
}

export const IdealYouProdSectionConfig: SectionConfigDetails = {
  COHORT_REPORTS: {
    SHOW_COHORT_WEIGHT_LOSS_REPORT: true,
    COHORTS: [
      { days: 10, gracePeriod: 2 },
      { days: 20, gracePeriod: 3 },
      { days: 30, gracePeriod: 5 },
      { days: 40, gracePeriod: 6 }
    ]
  }
}
