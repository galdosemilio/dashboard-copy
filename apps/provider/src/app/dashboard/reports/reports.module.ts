import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { SharedModule } from '@app/shared/shared.module'
import { StoreModule } from '@ngrx/store'

import {
  ReportsComponents,
  ReportsEntryComponents,
  ReportsProviders
} from './index'
import { store } from './store/index'

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    StoreModule.forFeature(store.name, store.reducers, store.config)
  ],
  declarations: ReportsComponents,
  entryComponents: ReportsEntryComponents,
  exports: ReportsComponents,
  providers: ReportsProviders
})
export class ReportsModule {}
