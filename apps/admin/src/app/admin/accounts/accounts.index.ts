export * from './form'
export * from './account'
export * from './affiliation'
export * from './list'

import { AccountDialogs, AccountResolver, AccountRoutes } from '@board/services'
import {
  AccountsDatabase,
  AccountsDataSource,
  ExternalIdentifiersDatabase,
  ExternalIdentifiersDataSource
} from '@coachcare/backend/data'
import { AffiliationAccountsDatabase } from '@coachcare/backend/data'
import { AccountComponent } from './account'
import {
  AffiliatedAccountsTableComponent,
  AffiliatedOrgComponent,
  AffiliationComponent
} from './affiliation'
import {
  AccountCSVDialogComponent,
  AddExternalIdentifierDialogComponent
} from './dialogs'
import { ExternalIdentifiersComponent } from './external-identifiers'
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
  DeviceSyncComponent,
  AddExternalIdentifierDialogComponent,
  ExternalIdentifiersComponent
]

export const AccountsEntryComponents = [
  AccountCSVDialogComponent,
  AddExternalIdentifierDialogComponent
]

export const AccountsProviders = [
  AccountsDatabase,
  AccountResolver,
  AccountRoutes,
  AccountDialogs,
  AccountsDataSource,
  AffiliationAccountsDatabase,
  ExternalIdentifiersDataSource,
  ExternalIdentifiersDatabase
]
