import { NgModule } from '@angular/core'
import { SharedModule } from '@app/shared/shared.module'
import { StoreModule } from '@ngrx/store'

import { ReportsComponents, ReportsProviders } from './index'
import { ReportsRoutingModule } from './reports.routing'
import { store } from './store/index'

@NgModule({
  imports: [
    ReportsRoutingModule,
    SharedModule,
    StoreModule.forFeature(store.name, store.reducers, store.config)
  ],
  declarations: ReportsComponents,
  exports: ReportsComponents,
  providers: ReportsProviders
})
export class ReportsModule {}
