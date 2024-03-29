import { Routes } from '@angular/router'
import { BoardLayout } from '@coachcare/layout'

import { OrganizationRoutes } from '@board/services'
import { NotFoundPageComponent } from '@board/shared/shared.barrel'

export const routes: Routes = [
  {
    path: '',
    component: BoardLayout,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: OrganizationRoutes.ADMIN
      },
      {
        path: OrganizationRoutes.ADMIN,
        loadChildren: () =>
          import('./organizations/organizations.module').then(
            (m) => m.OrganizationsModule
          )
      },
      {
        path: 'accounts',
        loadChildren: () =>
          import('./accounts/accounts.module').then((m) => m.AccountsModule)
      },
      {
        path: 'labels',
        loadChildren: () =>
          import('./labels/labels.module').then((m) => m.LabelsModule)
      },
      {
        path: 'measurements',
        loadChildren: () =>
          import('./measurements/measurements.module').then(
            (m) => m.MeasurementsModule
          )
      },
      {
        path: 'reports',
        loadChildren: () =>
          import('./reports/reports.module').then((m) => m.ReportsModule)
      },
      {
        path: 'cellular-device-history',
        loadChildren: () =>
          import(
            './cellular-device-history/cellular-device-history.module'
          ).then((m) => m.CellularDeviceHistoryModule)
      }
    ]
  },
  {
    // wildcard processing
    path: '**',
    component: BoardLayout,
    children: [
      {
        path: '',
        component: NotFoundPageComponent
      }
    ]
  }
]
