import { Routes } from '@angular/router'
import { AccountTypeId } from '@coachcare/sdk'

import { AccountResolver } from '@board/services'
import {
  AccountComponent,
  AccountFormComponent,
  AccountsListComponent,
  AffiliationComponent
} from './accounts.index'
import { ExternalIdentifiersComponent } from './external-identifiers'
import { EmailLogsComponent } from './email-logs'
import { AccountCareManagementComponent } from './account-care-management'

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'admins'
  },
  {
    path: 'admins',
    children: getAccountChildren(AccountTypeId.Admin)
  },
  {
    path: 'coaches',
    children: getAccountChildren(AccountTypeId.Provider)
  },
  {
    path: 'patients',
    children: getAccountChildren(AccountTypeId.Client)
  }
]

export function getAccountChildren(accountType: AccountTypeId): Routes {
  return [
    {
      path: '',
      component: AccountsListComponent,
      pathMatch: 'full',
      data: {
        accountType
      }
    },
    {
      path: 'create',
      component: AccountFormComponent,
      data: {
        accountType,
        readonly: false
      }
    },
    {
      path: ':id',
      component: AccountComponent,
      resolve: { account: AccountResolver },
      runGuardsAndResolvers: 'paramsOrQueryParamsChange',
      data: {
        accountType,
        readonly: true
      },
      children: [
        {
          path: '',
          pathMatch: 'full',
          redirectTo: 'data'
        },
        {
          path: 'data',
          children: [
            {
              path: '',
              pathMatch: 'full',
              component: AccountFormComponent
            },
            {
              path: 'edit',
              component: AccountFormComponent,
              // TODO implement CanDeactivate
              data: {
                readonly: false
              }
            }
          ]
        },
        {
          path: 'orgs',
          component: AffiliationComponent
        },
        // {
        //   path: 'logs',
        //   component: LogsListComponent
        // }
        {
          path: 'care-management',
          component: AccountCareManagementComponent
        },
        {
          path: 'external-identifiers',
          component: ExternalIdentifiersComponent
        },
        {
          path: 'email-log',
          component: EmailLogsComponent
        }
      ]
    }
  ]
}
