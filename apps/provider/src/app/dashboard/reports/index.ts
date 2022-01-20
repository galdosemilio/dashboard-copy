export * from './overview'
export * from './reports.component'
export * from './statistics'
export * from './rpm'

import {
  CommunicationsComponents,
  CommunicationsProviders
} from './communications'
import { ControlsComponents } from './controls'
import { CustomReportsComponents } from './custom'
import { OverviewComponents } from './overview'
import { ReportsComponent } from './reports.component'
import { RPMComponents } from './rpm'
import { StatisticsComponents } from './statistics'

import { ReportsDatabase, StatisticsDatabase } from './services'

export const ReportsComponents = [
  ...CommunicationsComponents,
  ...ControlsComponents,
  ...CustomReportsComponents,
  ...RPMComponents,
  ...StatisticsComponents,
  ...OverviewComponents,
  ReportsComponent
]

export const ReportsProviders = [
  ...CommunicationsProviders,
  ReportsDatabase,
  StatisticsDatabase
]
