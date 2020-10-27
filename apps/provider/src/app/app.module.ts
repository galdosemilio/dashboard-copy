import 'hammerjs';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  MissingTranslationHandler,
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { AppProviders, HttpLoaderFactory } from './service/app';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { AppRoutes } from './app.routing';
import { LayoutModule } from './layout/layout.module';
import { MatMomentDateModule, MissingStringsHandler } from './shared';

import { registerLocaleData } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import {
  RouterStateSerializer,
  StoreRouterConnectingModule,
} from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import {
  AppRouterStateSerializer,
  effects,
  metaReducers,
  reducers,
} from './store';

import localeEs from '@angular/common/locales/es';
import { SharedModule } from './shared/shared.module';

registerLocaleData(localeEs, 'es');

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useClass: MissingStringsHandler,
      },
    }),
    LayoutModule,
    MatMomentDateModule,
    AppRoutes,

    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot(effects),
    StoreRouterConnectingModule.forRoot(),
    !environment.production
      ? StoreDevtoolsModule.instrument({ maxAge: 50 })
      : [],
    SharedModule,
  ],
  providers: [
    AppProviders(),
    {
      provide: RouterStateSerializer,
      useClass: AppRouterStateSerializer,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
