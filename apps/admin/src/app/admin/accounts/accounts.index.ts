export * from './form'
export * from './account'
export * from './affiliation'
export * from './list'

import { AccountDialogs, AccountResolver, AccountRoutes } from '@board/services'
import { AccountsDatabase, AccountsDataSource } from '@coachcare/backend/data'
import { AffiliationAccountsDatabase } from '@coachcare/backend/data'
import { AccountComponent } from './account'
import {
  AffiliatedAccountsTableComponent,
  AffiliatedOrgComponent,
  AffiliationComponent
} from './affiliation'
import { AccountCSVDialogComponent } from './dialogs'
import { AccountFormComponent, DeviceSyncComponent } from './form'
import { AccountsListComponent, AccountsTableComponent } from './list'

export const AccountsComponents = [
  AccountComponent,
  AccountCSVDialogComponent,
  AccountFormComponent,
  AccountsListComponent,
  AccountsTableComponent,
  AffiliatedAccountsTableComponent,
  AffiliationComponent,
  AffiliatedOrgComponent,
  DeviceSyncComponent
]

export const AccountsEntryComponents = [AccountCSVDialogComponent]

export const AccountsProviders = [
  AccountsDatabase,
  AccountResolver,
  AccountRoutes,
  AccountDialogs,
  AccountsDataSource,
  AffiliationAccountsDatabase
]
