export * from './coaches.component'
export * from './form/coach.component'
export * from './services'

export * from './coach/coach.component'
export * from './coach/profile/profile.component'
export * from './coach/schedule/schedule.component'

import { MatSort } from '@coachcare/material'
import { CoachComponent } from './coach/coach.component'
import { CoachProfileComponent } from './coach/profile/profile.component'
import { CoachScheduleComponent } from './coach/schedule/schedule.component'
import { CoachesComponent } from './coaches.component'
import { CoachFormComponent } from './form/coach.component'
import { CoachResolver } from './services/coach.resolver'
import { CoachesDatabase } from './services/coaches.database'
import { CoachesTableComponent } from './table/table.component'

export const CoachesComponents = [
  CoachesComponent,
  CoachFormComponent,
  CoachesTableComponent,
  CoachComponent,
  CoachProfileComponent,
  CoachScheduleComponent
]

export const CoachesProviders = [CoachesDatabase, CoachResolver, MatSort]
