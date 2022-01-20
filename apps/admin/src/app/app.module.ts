import { NgModule } from '@angular/core'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { RouterModule, UrlSerializer } from '@angular/router'
import { AppCommonModule } from '@coachcare/common'
import { TranslateCatalogs } from '@coachcare/common/services'
import { MatMomentDateModule } from '@coachcare/datepicker'
import { environment } from '../environments/environment'
import { AppComponent } from './app.component'
import { routes } from './app.routing'
import { projectConfig } from './config/index'
import { PlusSignSerializer } from './services'
import { API_ENVIRONMENT } from '@coachcare/common/model'
import { CoachcareSdkModule } from '../../../../libs/common/src/lib/sdk.module'

// last ones overwrite the first
export const catalogs: TranslateCatalogs = {
  // common: './assets/i18n/common/${ lang }.json',
  dashboard: './assets/i18n/admin/${ lang }.json'
}

@NgModule({
  imports: [
    BrowserAnimationsModule,
    AppCommonModule.forRoot(environment, projectConfig, catalogs),
    MatMomentDateModule,
    CoachcareSdkModule,
    RouterModule.forRoot(routes, {
      enableTracing: false,
      initialNavigation: 'enabledBlocking',
      paramsInheritanceStrategy: 'always',
      relativeLinkResolution: 'legacy'
    })
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [
    { provide: API_ENVIRONMENT, useValue: environment },
    { provide: UrlSerializer, useClass: PlusSignSerializer }
  ]
})
export class AppModule {}
