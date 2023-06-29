import { Component, Inject } from '@angular/core'
import { MAT_DIALOG_DATA } from '@coachcare/material'
import { Sequence } from '@app/dashboard/sequencing/models'
import { GetAllSeqEnrollmentsResponse } from '@coachcare/sdk'

export interface TriggerDetailDialogProps {
  enrollment: GetAllSeqEnrollmentsResponse
  sequence: Sequence
}

@Component({
  selector: 'app-trigger-detail-dialog',
  templateUrl: './trigger-detail.dialog.html',
  host: { class: 'ccr-dialog' }
})
export class TriggerDetailDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: TriggerDetailDialogProps) {}
}
