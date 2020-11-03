import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { SharedModule } from '@app/shared/shared.module';
import { LayoutRoutes } from './layout.routing';
import { RightPanelModule } from './right-panel/right-panel.module';
import { effects, store } from './store/index';

import { ReportsModule } from '@app/dashboard/reports/reports.module';
import { CallModule } from '@app/layout/call/call.module';
import { LayoutComponent, LayoutComponents, LayoutEntryComponents } from './';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RightPanelModule,
    LayoutRoutes,
    CallModule,
    StoreModule.forFeature(store.name, store.reducers, store.config),
    EffectsModule.forFeature(effects),
    ReportsModule
  ],
  entryComponents: LayoutEntryComponents,
  exports: [RouterModule, LayoutComponent],
  declarations: LayoutComponents
})
export class LayoutModule {}
