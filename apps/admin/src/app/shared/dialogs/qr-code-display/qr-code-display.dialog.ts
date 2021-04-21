import { Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA } from '@coachcare/material'

export interface QRCodeDisplayDialogData {
  description?: string
  descriptionParams?: any
  qrData: string
  title: string
  titleParams?: any
}

@Component({
  selector: 'ccr-qr-code-display',
  templateUrl: 'qr-code-display.dialog.html',
  host: { class: 'ccr-dialog' }
})
export class QRCodeDisplayDialog implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: QRCodeDisplayDialogData) {}

  public ngOnInit(): void {
    console.log({ data: this.data })
  }
}
