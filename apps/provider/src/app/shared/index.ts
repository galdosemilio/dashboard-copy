export * from './components'
export * from './dialogs'
export * from './directives'
export * from './model'
export * from './utils'

import { CmpComponents, CmpEntryComponents } from './components'
import { LoginHistoryDatabase } from './components/login-history'
import { PackageDatabase } from './components/package-table/services'
import { Dialogs, Components as DialogComponents } from './dialogs'
import { Directives } from './directives'
import { IconComponents } from './icons'
import { Pipes } from './pipes'
// import { FeatureToggleInputComponent } from '@coachcare/common/components/form/fields/feature-toggle-input'
// import { CcrNoticeBlockquoteComponent } from '@coachcare/common/components/utilities/notice-blockquote'
import { SupervisingProvidersDatabase } from './dialogs/rpm-status/services'
import {
  ConfigService,
  EventsService,
  NotifierService
} from '@coachcare/common/services'

export const Components = [
  // FeatureToggleInputComponent,
  // CcrNoticeBlockquoteComponent,
  ...CmpComponents,
  ...IconComponents,
  ...DialogComponents,
  ...Dialogs,
  ...Directives,
  ...Pipes
]

export const EntryComponents = [...CmpEntryComponents, ...Dialogs]

export const Providers = [
  ConfigService,
  NotifierService,
  EventsService,
  PackageDatabase,
  LoginHistoryDatabase,
  SupervisingProvidersDatabase
]
