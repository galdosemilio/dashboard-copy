import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FlexLayoutModule } from '@angular/flex-layout'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { AppCommonModule } from '@coachcare/common'
import { CcrFormFieldsModule } from '@coachcare/common/components'
import { LayoutModule } from '@coachcare/layout'
import { TranslateModule } from '@ngx-translate/core'
import { ColorPickerModule } from 'ngx-color-picker'

import {
  SharedComponents,
  SharedEntryComponents
} from '@board/shared/shared.barrel'
import { CcrMaterialModule } from '@coachcare/material'
import { QRCodeModule } from 'angularx-qrcode'

@NgModule({
  imports: [
    CommonModule,
    ColorPickerModule,
    FlexLayoutModule,
    FormsModule,
    LayoutModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    AppCommonModule.forChild(),
    CcrFormFieldsModule,
    CcrMaterialModule,
    QRCodeModule
  ],
  exports: [
    FlexLayoutModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    AppCommonModule,
    CcrFormFieldsModule,
    ColorPickerModule,
    CcrMaterialModule,
    SharedComponents
  ],
  declarations: SharedComponents,
  entryComponents: SharedEntryComponents
})
export class SharedModule {}
