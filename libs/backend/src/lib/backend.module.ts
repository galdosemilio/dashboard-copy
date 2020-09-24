import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { API_ENVIRONMENT, ApiEnvironment } from '@coachcare/backend/shared';
import { CCRStoreModule } from '@coachcare/backend/store';
import { BackendProviders } from './backend.providers';

@NgModule({
  imports: [CommonModule],
  providers: BackendProviders
})
export class BackendModule {
  constructor(
    @Optional()
    @SkipSelf()
    parent: BackendModule
  ) {
    if (parent) {
      throw new Error('BackendModule is already loaded.');
    }
  }

  static forRoot(environment: ApiEnvironment): Array<ModuleWithProviders | ModuleWithProviders[]> {
    return [
      {
        ngModule: BackendModule,
        providers: [{ provide: API_ENVIRONMENT, useValue: environment }]
      },
      CCRStoreModule.forParent()
    ];
  }
}
