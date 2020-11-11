import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FlexLayoutModule } from '@angular/flex-layout'
import { ReactiveFormsModule } from '@angular/forms'
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatDialogModule,
  MatProgressSpinnerModule
} from '@coachcare/material'
import { CcrScheduleSelectModule } from './schedule-select/schedule-select.module'

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    CcrScheduleSelectModule
  ],
  exports: [CcrScheduleSelectModule]
})
export class CcrUsersDialogsModule {}
