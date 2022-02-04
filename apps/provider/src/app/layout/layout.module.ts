import { NgModule } from '@angular/core'
import { EffectsModule } from '@ngrx/effects'
import { StoreModule } from '@ngrx/store'

import { SharedModule } from '@app/shared/shared.module'
import { LayoutRoutingModule } from './layout.routing'
import { RightPanelModule } from './right-panel/right-panel.module'
import { effects, store } from './store/index'
import { CallModule } from '@app/layout/call/call.module'
import { LayoutComponent, LayoutComponents } from './'

@NgModule({
  imports: [
    SharedModule,
    RightPanelModule,
    LayoutRoutingModule,
    CallModule,
    StoreModule.forFeature(store.name, store.reducers, store.config),
    EffectsModule.forFeature(effects)
  ],
  exports: [LayoutComponent],
  declarations: LayoutComponents
})
export class LayoutModule {}
