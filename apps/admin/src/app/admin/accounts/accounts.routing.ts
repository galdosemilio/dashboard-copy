import { Routes } from '@angular/router';
import { AccountTypeId } from '@coachcare/backend/services';

import { AccountResolver } from '@board/services';
// import { LogsListComponent } from '../userlogs/userlogs.index';
import {
  AccountComponent,
  AccountFormComponent,
  AccountsListComponent,
  AffiliationComponent
} from './accounts.index';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'admins'
  },
  {
    path: 'admins',
    children: getAccountChildren('1')
  },
  {
    path: 'coaches',
    children: getAccountChildren('2')
  },
  {
    path: 'patients',
    children: getAccountChildren('3')
  }
];

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
        }
        // {
        //   path: 'logs',
        //   component: LogsListComponent
        // }
      ]
    }
  ];
}
