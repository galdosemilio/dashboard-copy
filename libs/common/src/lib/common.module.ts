import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { ModuleWithProviders, NgModule } from '@angular/core'
import { FlexLayoutModule } from '@angular/flex-layout'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
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
import { AppI18nModule } from './i18n.module'
import { CCRStoreModule } from './store/ccr'

@NgModule({
  imports: [
    CommonModule,
    CcrFormFieldsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    FlexLayoutModule,
    RouterModule,
    CcrCoreDialogsModule,
    CcrDirectivesModule,
    CcrPipesModule,
    CcrUtilityComponentsModule
  ],
  declarations: [],
  exports: [
    CcrCoreDialogsModule,
    CcrDirectivesModule,
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
      ...CCRStoreModule.forParent(),
      AppI18nModule.forRoot(),
      ...AppStoreModule.forRoot(environment)
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
