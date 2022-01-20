import { CommonModule, registerLocaleData } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { ModuleWithProviders, NgModule } from '@angular/core'
import {
  MissingTranslationHandler,
  TranslateLoader,
  TranslateModule
} from '@ngx-translate/core'
import {
  I18N_CATALOGS,
  TranslateLoaderFactory
} from '@coachcare/common/services'
import {
  AppLocaleCode,
  locales,
  MissingStringsHandler
} from '@coachcare/common/shared'

// register supported locales
locales.forEach(async (code: AppLocaleCode) => {
  try {
    const locale = await import(
      /* webpackInclude: /(ar-ae|ar-bh|ar-eg|ar-kw|ar-lb|ar-om|ar-sa|da|de|en-au|en-ca|en-gb|en-nz|en|es-cl|es-co|es-mx|es-us|es|fr|he|it|pt-br|pt)\.mjs$/i */
      /* webpackMode: 'lazy-once' */
      /* webpackChunkName: 'common-locales' */
      `../../../../node_modules/@angular/common/locales/${code}.mjs`
    )
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
