import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSnackBarModule } from '@coachcare/layout';
import { MatDialogModule } from '@coachcare/layout';
import { RouterModule } from '@angular/router';
import { BackendModule } from '@coachcare/backend';
import { CcrUtilityComponentsModule } from '@coachcare/common/components';
import { CcrCoreDialogsModule } from '@coachcare/common/dialogs/core';
import { CcrDirectivesModule } from '@coachcare/common/directives';
import { CcrPipesModule } from '@coachcare/common/pipes';
import { AppProviders, TranslateCatalogs } from '@coachcare/common/services';
import { AppConfig, AppEnvironment } from '@coachcare/common/shared';
import { AppStoreModule } from '@coachcare/common/store';
import { AppI18nModule } from './i18n.module';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FlexLayoutModule,
    MatDialogModule,
    MatSnackBarModule,
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
    CcrUtilityComponentsModule
  ]
})
export class AppCommonModule {
  static forRoot(
    environment: AppEnvironment,
    config: AppConfig,
    catalogs: TranslateCatalogs
  ): Array<ModuleWithProviders | any[]> {
    return [
      {
        ngModule: AppCommonModule,
        providers: AppProviders(environment, config, catalogs)
      },
      AppI18nModule.forRoot(),
      AppStoreModule.forRoot(environment),
      BackendModule.forRoot(environment)
    ];
  }

  static forChild(): Array<ModuleWithProviders | ModuleWithProviders[]> {
    return [
      // {
      //   ngModule: AppCommonModule,
      //   providers: AppProviders(environment, config, catalogs)
      // }
    ];
  }
}
