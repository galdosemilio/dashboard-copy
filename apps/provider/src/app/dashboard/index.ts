export * from './accounts'
export * from './library'
export * from './resources'
export * from './profile'
export * from './reports'
export * from './alerts'
export * from './components'
export * from './schedule/new-appointment'

import { PanelComponents } from './panel'
import { ProfileComponents } from './profile'
import { ResourcesComponents } from './resources'
import { DashboardSubcomponents } from './components'

export const DashboardComponents = [
  ...PanelComponents,
  ...ResourcesComponents,
  ...ProfileComponents,
  ...DashboardSubcomponents
]
