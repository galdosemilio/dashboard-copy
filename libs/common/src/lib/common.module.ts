import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { ModuleWithProviders, NgModule } from '@angular/core'
import { FlexLayoutModule } from '@angular/flex-layout'
import { RouterModule } from '@angular/router'
import { BackendModule } from '@coachcare/backend'
import {
  CcrFormFieldsModule,
  CcrUtilityComponentsModule
} from '@coachcare/common/components'
import { CcrCoreDialogsModule } from '@coachcare/common/dialogs/core'
import { CcrDirectivesModule } from '@coachcare/common/directives'
import { CcrPipesModule } from '@coachcare/common/pipes'
import { AppProviders, TranslateCatalogs } from '@coachcare/common/services'
import { AppConfig, AppEnvironment } from '@coachcare/common/shared'
import { AppStoreModule } from '@coachcare/common/store'
import { NpmApiModule } from '@coachcare/npm-api'
import { AppI18nModule } from './i18n.module'
import { CcrMaterialModule } from './material/material.module'

@NgModule({
  imports: [
    CommonModule,
    CcrFormFieldsModule,
    CcrMaterialModule,
    HttpClientModule,
    FlexLayoutModule,
    RouterModule,
    CcrCoreDialogsModule,
    CcrDirectivesModule,
    CcrPipesModule,
    CcrUtilityComponentsModule,
    NpmApiModule
  ],
  declarations: [],
  exports: [
    CcrCoreDialogsModule,
    CcrDirectivesModule,
    CcrMaterialModule,
    CcrPipesModule,
    CcrFormFieldsModule,
    CcrUtilityComponentsModule
  ]
})
export class AppCommonModule {
  static forRoot(
    environment: AppEnvironment,
    config: AppConfig,
    catalogs: TranslateCatalogs
  ): ModuleWithProviders<NgModule>[] {
    return [
      {
        ngModule: AppCommonModule,
        providers: AppProviders(environment, config, catalogs)
      },
      AppI18nModule.forRoot(),
      ...AppStoreModule.forRoot(environment),
      ...BackendModule.forRoot(environment)
    ]
  }

  static forChild(): ModuleWithProviders<NgModule>[] {
    return [
      // {
      //   ngModule: AppCommonModule,
      //   providers: AppProviders(environment, config, catalogs)
      // }
    ]
  }
}
