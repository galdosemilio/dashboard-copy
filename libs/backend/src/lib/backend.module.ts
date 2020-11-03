import { CommonModule } from '@angular/common'
import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf
} from '@angular/core'
import { API_ENVIRONMENT, ApiEnvironment } from '@coachcare/backend/shared'
import { CCRStoreModule } from '@coachcare/backend/store'

@NgModule({
  imports: [CommonModule]
})
export class BackendModule {
  constructor(
    @Optional()
    @SkipSelf()
    parent: BackendModule
  ) {
    if (parent) {
      throw new Error('BackendModule is already loaded.')
    }
  }

  static forRoot(environment: ApiEnvironment): ModuleWithProviders<NgModule>[] {
    return [
      {
        ngModule: BackendModule,
        providers: [{ provide: API_ENVIRONMENT, useValue: environment }]
      },
      ...CCRStoreModule.forParent()
    ]
  }
}
