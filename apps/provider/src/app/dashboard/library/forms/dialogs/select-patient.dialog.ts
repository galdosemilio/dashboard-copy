import { Component } from '@angular/core'
import {
  MAT_LABEL_GLOBAL_OPTIONS,
  MatDialogRef
} from '@coachcare/common/material'
import { AccountAccessData } from '@coachcare/npm-api'

@Component({
  selector: 'app-library-patient-select-dialog',
  templateUrl: './select-patient.dialog.html',
  styleUrls: ['./select-patient.dialog.scss'],
  host: { class: 'ccr-dialog' },
  providers: [
    { provide: MAT_LABEL_GLOBAL_OPTIONS, useValue: { float: 'always' } }
  ]
})
export class PatientSelectDialog {
  constructor(private dialogRef: MatDialogRef<PatientSelectDialog>) {}

  cancel() {
    this.dialogRef.close()
  }

  remove() {
    this.dialogRef.close(undefined)
  }

  select(dieter: AccountAccessData) {
    this.dialogRef.close(dieter)
  }
}
