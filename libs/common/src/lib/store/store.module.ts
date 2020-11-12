import { CommonModule } from '@angular/common'
import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf
} from '@angular/core'
import { EffectsModule } from '@ngrx/effects'
import { StoreRouterConnectingModule } from '@ngrx/router-store'
import { StoreModule } from '@ngrx/store'
import { StoreDevtoolsModule } from '@ngrx/store-devtools'

import { AppEnvironment } from '@coachcare/common/shared'
import { effects } from './effects'
import { devMetaReducers, reducers } from './reducers'
import { AppRouterStateSerializer } from './router/serializer'
import { AppStoreFacade } from './store.facade'

@NgModule({
  imports: [CommonModule]
})
export class AppStoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parent: AppStoreModule
  ) {
    if (parent) {
      throw new Error('AppStoreModule is already loaded.')
    }
  }

  static forRoot(environment: AppEnvironment): ModuleWithProviders<NgModule>[] {
    return [
      {
        ngModule: AppStoreModule,
        providers: [AppStoreFacade]
      },
      StoreModule.forRoot(reducers, {
        metaReducers: !environment.production ? devMetaReducers : []
      }),
      EffectsModule.forRoot(effects),
      StoreRouterConnectingModule.forRoot({
        serializer: AppRouterStateSerializer
      }),
      // {
      //   ngModule: ,
      //   providers: [
      //     {
      //       provide: RouterStateSerializer,
      //       useClass: AppRouterStateSerializer
      //     }
      //   ]
      // },
      !environment.production
        ? StoreDevtoolsModule.instrument({ maxAge: 50 })
        : { ngModule: AppStoreModule }
    ]
  }
}
