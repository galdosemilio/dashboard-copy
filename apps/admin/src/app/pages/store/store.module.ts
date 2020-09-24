import { CommonModule } from '@angular/common';
import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
} from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { effects } from './effects';

@NgModule({
  imports: [CommonModule],
})
export class PagesStoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parent: PagesStoreModule
  ) {
    if (parent) {
      throw new Error('PagesStoreModule is already loaded.');
    }
  }

  static forParent(): ModuleWithProviders<NgModule>[] {
    return [EffectsModule.forFeature(effects)];
  }
}
