export * from './components'
export * from './dialogs'
export * from './directives'
export * from './helpers'
export * from './model'
export * from './utils'

import { CmpComponents } from './components'
import { LoginHistoryDatabase } from './components/login-history'
import { MeetingsDatabase } from './components/schedule/services'
import { PackageDatabase } from './components/package-table/services'
import { PhasesDatabase } from './components/account-phase-list/services'
import { Dialogs, Components as DialogComponents } from './dialogs'
import { Directives } from './directives'
import { IconComponents } from './icons'
import { Pipes } from './pipes'
import { SupervisingProvidersDatabase } from './dialogs/rpm-status/services'
import { DatePipe } from '@angular/common'
import { CallControlService, EventsService } from '@coachcare/common/services'

export const Components = [
  ...CmpComponents,
  ...IconComponents,
  ...DialogComponents,
  ...Dialogs,
  ...Directives,
  ...Pipes
]

export const Providers = [
  EventsService,
  PackageDatabase,
  LoginHistoryDatabase,
  SupervisingProvidersDatabase,
  CallControlService,
  MeetingsDatabase,
  PhasesDatabase,
  DatePipe
]
