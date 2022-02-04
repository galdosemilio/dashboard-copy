import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { SharedModule } from '@app/shared/shared.module'

import { ScheduleComponents, ScheduleProviders } from './'
import { ScheduleRoutingModule } from './schedule.routing'

@NgModule({
  imports: [ScheduleRoutingModule, SharedModule],
  exports: [RouterModule, ...ScheduleComponents],
  declarations: ScheduleComponents,
  providers: ScheduleProviders
})
export class ScheduleModule {}
