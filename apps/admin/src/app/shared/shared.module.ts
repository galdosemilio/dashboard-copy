import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FlexLayoutModule } from '@angular/flex-layout'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { AppCommonModule } from '@coachcare/common'
import { CcrFormFieldsModule } from '@coachcare/common/components'
import { LayoutModule } from '@coachcare/layout'
import { TranslateModule } from '@ngx-translate/core'
import { ColorPickerModule } from 'ngx-color-picker'
import { SharedComponents } from '@board/shared/shared.barrel'
import { CcrMaterialModule } from '@coachcare/material'
import { QRCodeModule } from 'angularx-qrcode'
import { MatMomentDateModule } from '@coachcare/datepicker'
import { MomentModule } from 'ngx-moment'

@NgModule({
  imports: [
    CommonModule,
    ColorPickerModule,
    FlexLayoutModule,
    FormsModule,
    LayoutModule,
    MatMomentDateModule,
    MomentModule,
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
    MomentModule,
    CcrFormFieldsModule,
    ColorPickerModule,
    CcrMaterialModule,
    ...SharedComponents
  ],
  declarations: SharedComponents
})
export class SharedModule {}
