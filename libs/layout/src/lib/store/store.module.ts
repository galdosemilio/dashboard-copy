import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { effects } from './effects';
import { reducers } from './reducers';
import { NAME } from './selectors';
import { initialState } from './state';

@NgModule({
  imports: [CommonModule]
})
export class LayoutStoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parent: LayoutStoreModule
  ) {
    if (parent) {
      throw new Error('LayoutStoreModule is already loaded.');
    }
  }

  static forParent(): ModuleWithProviders[] {
    return [
      StoreModule.forFeature(NAME, reducers, { initialState }),
      EffectsModule.forFeature(effects)
    ];
  }
}
