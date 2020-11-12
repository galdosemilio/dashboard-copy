export * from './statistics.component'
export * from './patient-activity'
export * from './patient-stats'
export * from './coach-stats'

import { CoachComponents } from './coach-stats'
import { PatientActvityComponents } from './patient-activity'
import { PatientStatsComponents } from './patient-stats'
import { StatisticsComponent } from './statistics.component'

export const StatisticsComponents = [
  ...CoachComponents,
  ...PatientActvityComponents,
  ...PatientStatsComponents,
  StatisticsComponent
]
