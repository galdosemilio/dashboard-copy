export * from './alerts.component'
export * from './services'
export * from './settings'
export * from './table/table.component'

import { AlertInfoComponent } from './alert-info/alert-info.component'
import { AlertsComponent } from './alerts.component'
import { AlertDataThresholdDialog } from './dialogs'
import { AlertsDatabase } from './services'
import { AlertsSettingsComponent, AlertTypesTableComponent } from './settings'
import { AlertsTableComponent } from './table/table.component'

export const AlertsComponents = [
  AlertsComponent,
  AlertDataThresholdDialog,
  AlertInfoComponent,
  AlertsSettingsComponent,
  AlertsTableComponent,
  AlertTypesTableComponent
]

export const AlertsProviders = [AlertsDatabase]
