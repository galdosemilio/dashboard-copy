export { DashboardComponent } from './dashboard.component'
export * from './layouts'

import { DashboardComponent } from './dashboard.component'
import {
  DefaultDashboardComponent,
  WellcoreDashboardComponent
} from './layouts'

export const PanelComponents = [
  DashboardComponent,
  DefaultDashboardComponent,
  WellcoreDashboardComponent
]
