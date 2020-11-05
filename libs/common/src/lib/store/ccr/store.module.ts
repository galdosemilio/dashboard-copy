import { CommonModule } from '@angular/common';
import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
} from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { effects } from './effects';
import { reducers } from './reducers';
import { NAME } from './selectors';
import { initialState } from './state';
import { CCRFacade } from './store.facade';

@NgModule({
  imports: [CommonModule],
})
export class CCRStoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parent: CCRStoreModule
  ) {
    if (parent) {
      throw new Error('CCRStoreModule is already loaded.');
    }
  }

  static forParent(): ModuleWithProviders<NgModule>[] {
    return [
      {
        ngModule: CCRStoreModule,
        providers: [CCRFacade],
      },
      StoreModule.forFeature(NAME, reducers, { initialState }),
      EffectsModule.forFeature(effects),
    ];
  }
}
