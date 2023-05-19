export * from './statistics.component'
export * from './patient-activity'
export * from './patient-stats'
export * from './coach-stats'
export * from './cohort-weight-loss'

import { CoachComponents } from './coach-stats'
import { PatientActvityComponents } from './patient-activity'
import { PatientStatsComponents } from './patient-stats'
import { StatisticsComponent } from './statistics.component'
import { CohortWeightLossComponent } from './cohort-weight-loss'
import { SharpReportComponent } from './sharp-report'

export const StatisticsComponents = [
  ...CoachComponents,
  ...PatientActvityComponents,
  ...PatientStatsComponents,
  SharpReportComponent,
  StatisticsComponent,
  CohortWeightLossComponent
]
