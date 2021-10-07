export * from './accounts'
export * from './content'
export * from './library'
export * from './resources'
export * from './profile'
export * from './reports'
export * from './alerts'
export * from './my-schedule'
export * from './new-appointment'

import {
  AccountComponents,
  AccountEntryComponents,
  AccountProviders
} from './accounts'
import { ContentEntryComponents, ContentProviders } from './content'
import {
  LibraryComponents,
  LibraryEntryComponents,
  LibraryProviders
} from './library'
import { PanelComponents } from './panel'
import {
  ProfileComponents,
  ProfileEntryComponents,
  UserProfileProviders
} from './profile'
import { ResourcesComponents, ResourcesEntryComponents } from './resources'
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

export const DashboardEntryComponents = [
  ...AccountEntryComponents,
  ...ContentEntryComponents,
  ...LibraryEntryComponents,
  ...ResourcesEntryComponents,
  ...ProfileEntryComponents,
  ...MyScheduleComponents,
  ...NewAppointmentComponents
]

export const DashboardProviders = [
  ...AccountProviders,
  ...ContentProviders,
  ...LibraryProviders,
  ...UserProfileProviders
]
