import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FlexLayoutModule } from '@angular/flex-layout'
import { ReactiveFormsModule } from '@angular/forms'
import { CcrFormFieldsModule } from '@coachcare/common/components/form/form.module'
import { CcrMaterialModule } from '@coachcare/material'
import { CcrAddOrganizationDialog } from './add-organization'

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    CcrMaterialModule,
    CcrFormFieldsModule
  ],
  declarations: [CcrAddOrganizationDialog],
  exports: []
})
export class CcrOrganizationDialogsModule {}
