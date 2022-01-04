import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FlexLayoutModule } from '@angular/flex-layout'
import { ReactiveFormsModule } from '@angular/forms'
import { CcrFormFieldsModule } from '@coachcare/common/components/form/form.module'
import { CcrMaterialModule } from '@coachcare/material'
import { TranslateModule } from '@ngx-translate/core'
import { CcrAddOrganizationDialog } from './add-organization'

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    CcrMaterialModule,
    CcrFormFieldsModule,
    TranslateModule
  ],
  declarations: [CcrAddOrganizationDialog],
  exports: []
})
export class CcrOrganizationDialogsModule {}
