import { HttpClient, HttpClientModule } from '@angular/common/http'
import {
  MissingTranslationHandler,
  TranslateLoader,
  TranslateModule
} from '@ngx-translate/core'
import { AppProviders } from './service/app'

import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { environment } from '../environments/environment'
import { AppComponent } from './app.component'
import { AppRoutes } from './app.routing'
import { LayoutModule } from './layout/layout.module'
import { MissingStringsHandler } from './shared'

import { registerLocaleData } from '@angular/common'
import { EffectsModule } from '@ngrx/effects'
import {
  RouterStateSerializer,
  StoreRouterConnectingModule
} from '@ngrx/router-store'
import { StoreModule } from '@ngrx/store'
import { StoreDevtoolsModule } from '@ngrx/store-devtools'
import {
  AppRouterStateSerializer,
  effects,
  metaReducers,
  reducers
} from './store'

import localeEs from '@angular/common/locales/es'
import { SharedModule } from './shared/shared.module'
import { API_ENVIRONMENT } from '@coachcare/common/model'
import {
  I18N_CATALOGS,
  TranslateLoaderFactory
} from '@coachcare/common/services'

registerLocaleData(localeEs, 'es')

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: TranslateLoaderFactory,
        deps: [HttpClient, I18N_CATALOGS]
      },
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useClass: MissingStringsHandler
      }
    }),
    SharedModule,
    LayoutModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot(effects),
    StoreRouterConnectingModule.forRoot(),
    !environment.production
      ? StoreDevtoolsModule.instrument({ maxAge: 50 })
      : [],
    AppRoutes
  ],
  providers: [
    {
      provide: API_ENVIRONMENT,
      useValue: environment
    },
    {
      provide: RouterStateSerializer,
      useClass: AppRouterStateSerializer
    },
    ...AppProviders()
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
