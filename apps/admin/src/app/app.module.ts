// tslint:disable:no-invalid-template-strings
import { NgModule } from '@angular/core';
import { MAT_LABEL_GLOBAL_OPTIONS } from '@coachcare/common/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, UrlSerializer } from '@angular/router';
import { AppCommonModule } from '@coachcare/common';
import { TranslateCatalogs } from '@coachcare/common/services';
import { MatMomentDateModule } from '@coachcare/datepicker';
import { NxModule } from '@nrwl/nx';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { routes } from './app.routing';
import { projectConfig } from './config/index';
import { PlusSignSerializer } from './services';

// last ones overwrite the first
export const catalogs: TranslateCatalogs = {
  // common: './assets/i18n/common/${ lang }.json',
  dashboard: './assets/i18n/admin/${ lang }.json',
};

@NgModule({
  imports: [
    BrowserAnimationsModule,
    NxModule.forRoot(),
    AppCommonModule.forRoot(environment, projectConfig, catalogs),
    MatMomentDateModule,
    RouterModule.forRoot(routes, {
      enableTracing: false, // debugging
      initialNavigation: 'enabled',
      paramsInheritanceStrategy: 'always',
    }),
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [
    { provide: MAT_LABEL_GLOBAL_OPTIONS, useValue: { float: 'always' } },
    { provide: UrlSerializer, useClass: PlusSignSerializer },
  ],
})
export class AppModule {}
