import { NgModule } from '@angular/core'

import { SharedModule } from '../shared/shared.module'
import { DashboardComponents } from './'
import { AlertsModule } from './alerts/alerts.module'
import { DashboardRoutingModule } from './dashboard.routing'
import { LibraryModule } from './library/library.module'
import { ReportsModule } from './reports/reports.module'

@NgModule({
  imports: [
    SharedModule,
    DashboardRoutingModule,
    AlertsModule,
    ReportsModule,
    LibraryModule
  ],
  declarations: DashboardComponents
})
export class DashboardModule {}
