/**
 * TODO build a date-format directive that listen lang changes like:
 * https://github.com/ngx-translate/core/blob/master/src/translate.directive.ts
 *
 * Details of CDK modules can be found on:
 * https://github.com/angular/material2/tree/master/src/cdk
 */
import { A11yModule } from '@angular/cdk/a11y'
import { ObserversModule } from '@angular/cdk/observers'
import { OverlayModule } from '@angular/cdk/overlay'
import { PlatformModule } from '@angular/cdk/platform'
import { PortalModule } from '@angular/cdk/portal'
import { CdkTableModule } from '@angular/cdk/table'
import { TextFieldModule } from '@angular/cdk/text-field'
import { CommonModule, registerLocaleData } from '@angular/common'
import { NgModule } from '@angular/core'
import { FlexLayoutModule } from '@angular/flex-layout'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { CcrMaterialModule } from '@coachcare/material'
import { RouterModule } from '@angular/router'
import { MatDatepickerModule } from '@coachcare/datepicker'
import { TranslateModule } from '@ngx-translate/core'
import { QRCodeModule } from 'angularx-qrcode'
import { ChartsModule } from 'ng2-charts'
import { MomentModule } from 'ngx-moment'
import { Components, Providers } from './index'
import { AppLocaleCode, locales } from './utils'
import {
  CcrFormFieldsModule,
  CcrUtilityComponentsModule
} from '@coachcare/common/components'
import { CcrCoreDialogsModule } from '@coachcare/common/dialogs/core'

// register supported locales
locales.forEach(async (code: AppLocaleCode) => {
  try {
    const locale = await import(
      /* webpackInclude: /(ar-ae|ar-bh|ar-eg|ar-kw|ar-lb|ar-om|ar-sa|da|de|en-au|en-ca|en-gb|en-nz|en|es-cl|es-co|es-mx|es-us|es|fr|he|it|pt-br|pt)\.mjs$/i */
      /* webpackMode: 'lazy-once' */
      /* webpackChunkName: 'provider-locales' */
      `../../../../../node_modules/@angular/common/locales/${code}.mjs`
    )
    registerLocaleData(locale.default)
  } catch (e) {
    // fail silently
    // console.warn(e)
  }
})

const SHARED_MODULES = [
  A11yModule,
  CcrCoreDialogsModule,
  CcrFormFieldsModule,
  CcrUtilityComponentsModule,
  CdkTableModule,
  ObserversModule,
  OverlayModule,
  PortalModule,
  FlexLayoutModule,
  FormsModule,
  ReactiveFormsModule,
  PlatformModule,
  TextFieldModule,
  TranslateModule,
  MatDatepickerModule,
  MomentModule,
  ChartsModule,
  QRCodeModule,
  CcrMaterialModule
]

@NgModule({
  imports: [CommonModule, RouterModule, ...SHARED_MODULES],
  declarations: Components,
  exports: [...Components, ...SHARED_MODULES],
  providers: [...Providers]
})
export class SharedModule {}
