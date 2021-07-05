export * from './accounts'
export * from './content'
export * from './library'
export * from './resources'
export * from './profile'
export * from './reports'
export * from './alerts'

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

export const DashboardComponents = [
  ...PanelComponents,
  ...AccountComponents,
  ...LibraryComponents,
  ...ResourcesComponents,
  ...ProfileComponents
]

export const DashboardEntryComponents = [
  ...AccountEntryComponents,
  ...ContentEntryComponents,
  ...LibraryEntryComponents,
  ...ResourcesEntryComponents,
  ...ProfileEntryComponents
]

export const DashboardProviders = [
  ...AccountProviders,
  ...ContentProviders,
  ...LibraryProviders,
  ...UserProfileProviders
]
