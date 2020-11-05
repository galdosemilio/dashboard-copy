import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { SharedModule } from '@app/shared/shared.module'

import {
  ScheduleComponents,
  ScheduleEntryComponents,
  ScheduleProviders
} from './'
import { ScheduleRoutes } from './schedule.routing'

@NgModule({
  imports: [CommonModule, RouterModule.forChild(ScheduleRoutes), SharedModule],
  exports: [RouterModule, ...ScheduleComponents],
  declarations: ScheduleComponents,
  providers: ScheduleProviders,
  entryComponents: ScheduleEntryComponents
})
export class ScheduleModule {}
