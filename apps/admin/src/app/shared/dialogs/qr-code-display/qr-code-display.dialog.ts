import { Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA } from '@coachcare/material'

export interface QRCodeDisplayDialogData {
  description?: string
  descriptionParams?: Record<string, string | number>
  qrData: string
  title: string
  titleParams?: Record<string, string | number>
}

@Component({
  selector: 'ccr-qr-code-display',
  templateUrl: 'qr-code-display.dialog.html',
  host: { class: 'ccr-dialog' }
})
export class QRCodeDisplayDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: QRCodeDisplayDialogData) {}
}
