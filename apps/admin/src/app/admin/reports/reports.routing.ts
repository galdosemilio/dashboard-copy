import { Routes } from '@angular/router'
import {
  EcommerceReportComponent,
  ReportsListComponent,
  ReportOverviewComponent
} from './overview'

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'overview'
  },
  {
    path: 'overview',
    component: ReportOverviewComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'list'
      },
      {
        path: 'list',
        component: ReportsListComponent
      },
      {
        path: 'ecommerce',
        component: EcommerceReportComponent
      }
    ]
  }
]
