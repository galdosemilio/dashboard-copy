import { CommonModule, registerLocaleData } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { ModuleWithProviders, NgModule } from '@angular/core'
import {
  MissingTranslationHandler,
  TranslateLoader,
  TranslateModule
} from '@ngx-translate/core'

import { MissingStringsHandler } from '@coachcare/backend/shared'
import {
  I18N_CATALOGS,
  TranslateLoaderFactory
} from '@coachcare/common/services'
import { AppLocaleCode, locales } from '@coachcare/common/shared'

// register supported locales
locales.forEach(async (code: AppLocaleCode) => {
  try {
    const locale = await import(`@angular/common/locales/${code}.js`)
    registerLocaleData(locale.default)
  } catch (e) {
    console.error(e)
  }
})

@NgModule({
  imports: [CommonModule]
})
export class AppI18nModule {
  static forRoot(): ModuleWithProviders<TranslateModule> {
    return TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: TranslateLoaderFactory,
        deps: [HttpClient, I18N_CATALOGS]
      },
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useClass: MissingStringsHandler
      }
    })
  }
}
