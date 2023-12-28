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
import { SelectorsComponents } from './service-type-selector'
import { DeviceComponents } from './device'

import { ReportsDatabase, StatisticsDatabase, TaskDatabase } from './services'
import { ReportsDialogComponents } from './dialogs'

export const ReportsComponents = [
  ...CommunicationsComponents,
  ...ControlsComponents,
  ...CustomReportsComponents,
  ...RPMComponents,
  ...ReportsDialogComponents,
  ...StatisticsComponents,
  ...OverviewComponents,
  ...SelectorsComponents,
  ...DeviceComponents,
  ReportsComponent
]

export const ReportsProviders = [
  ...CommunicationsProviders,
  ReportsDatabase,
  StatisticsDatabase,
  TaskDatabase
]
