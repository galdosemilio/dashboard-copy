export * from './accounts'
export * from './content'
export * from './library'
export * from './resources'
export * from './profile'
export * from './reports'
export * from './alerts'
export * from './my-schedule'
export * from './new-appointment'

import { AccountComponents, AccountProviders } from './accounts'
import { ContentProviders } from './content'
import { LibraryComponents, LibraryProviders } from './library'
import { PanelComponents } from './panel'
import { ProfileComponents, UserProfileProviders } from './profile'
import { ResourcesComponents } from './resources'
import { MyScheduleComponents } from './my-schedule'
import { NewAppointmentComponents } from './new-appointment'

export const DashboardComponents = [
  ...PanelComponents,
  ...AccountComponents,
  ...LibraryComponents,
  ...ResourcesComponents,
  ...ProfileComponents,
  ...MyScheduleComponents,
  ...NewAppointmentComponents
]

export const DashboardProviders = [
  ...AccountProviders,
  ...ContentProviders,
  ...LibraryProviders,
  ...UserProfileProviders
]
