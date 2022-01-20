import { Component } from '@angular/core'
import { MatDialogRef } from '@coachcare/material'
import { AccountAccessData } from '@coachcare/sdk'

@Component({
  selector: 'app-library-patient-select-dialog',
  templateUrl: './select-patient.dialog.html',
  styleUrls: ['./select-patient.dialog.scss'],
  host: { class: 'ccr-dialog' }
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
