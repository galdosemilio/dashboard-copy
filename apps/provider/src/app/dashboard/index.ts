export * from './accounts'
export * from './content'
export * from './library'
export * from './resources'
export * from './profile'
export * from './reports'
export * from './alerts'
export * from './my-schedule'

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

export const DashboardComponents = [
  ...PanelComponents,
  ...AccountComponents,
  ...LibraryComponents,
  ...ResourcesComponents,
  ...ProfileComponents,
  ...MyScheduleComponents
]

export const DashboardEntryComponents = [
  ...AccountEntryComponents,
  ...ContentEntryComponents,
  ...LibraryEntryComponents,
  ...ResourcesEntryComponents,
  ...ProfileEntryComponents,
  ...MyScheduleComponents
]

export const DashboardProviders = [
  ...AccountProviders,
  ...ContentProviders,
  ...LibraryProviders,
  ...UserProfileProviders
]
