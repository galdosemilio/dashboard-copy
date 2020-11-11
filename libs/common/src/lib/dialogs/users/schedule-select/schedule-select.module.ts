import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import {
  MatAutocompleteModule,
  MatDialogModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatSelectModule
} from '@coachcare/material'
import { CcrIconsComponentsModule } from '@coachcare/common/components/icons'
import { TranslateModule } from '@ngx-translate/core'
import { ScheduleSelectDialog } from './schedule-select.dialog'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    TranslateModule,
    CcrIconsComponentsModule
  ],
  declarations: [ScheduleSelectDialog],
  entryComponents: [ScheduleSelectDialog],
  exports: [ScheduleSelectDialog]
})
export class CcrScheduleSelectModule {}
