export * from './list/index'
export * from './table/index'

import { LogsDatabase } from '@coachcare/backend/data'
import { LogsListComponent } from './list/index'
import { LogsTableComponent } from './table/index'

export const UserLogsComponents = [LogsListComponent, LogsTableComponent]

export const UserLogsEntryComponents = []

export const UserLogsProviders = [LogsDatabase]
