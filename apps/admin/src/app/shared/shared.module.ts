import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppCommonModule } from '@coachcare/common';
import { CcrFormFieldsModule } from '@coachcare/common/components';
import { LayoutModule } from '@coachcare/layout';
import { TranslateModule } from '@ngx-translate/core';
import { ColorPickerModule } from 'ngx-color-picker';

import {
  SharedComponents,
  SharedEntryComponents,
} from '@board/shared/shared.barrel';
import { CcrMaterialModule } from '@coachcare/common/material/material.module';

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
    SharedComponents,
  ],
  declarations: SharedComponents,
  entryComponents: SharedEntryComponents,
})
export class SharedModule {}
