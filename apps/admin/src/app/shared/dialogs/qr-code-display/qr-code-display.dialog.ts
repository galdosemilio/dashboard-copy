import { Component, Inject, ViewChild } from '@angular/core'
import { MAT_DIALOG_DATA } from '@coachcare/material'
import { NamedEntity } from '@coachcare/sdk'
import { QRCodeComponent } from 'angularx-qrcode'

export interface QRCodeDisplayDialogData {
  description?: string
  descriptionParams?: Record<string, string | number>
  organization: NamedEntity
  qrData: string
  title: string
  appType: 'ios' | 'android'
  titleParams?: Record<string, string | number>
}

@Component({
  selector: 'ccr-qr-code-display',
  templateUrl: 'qr-code-display.dialog.html',
  host: { class: 'ccr-dialog' }
})
export class QRCodeDisplayDialog {
  @ViewChild('downloadableQrCode', { static: false })
  downQrCode: QRCodeComponent

  constructor(@Inject(MAT_DIALOG_DATA) public data: QRCodeDisplayDialogData) {}

  downloadQRCode(): void {
    const canvas = this.downQrCode.qrcElement.nativeElement.firstChild
    const link = document.createElement('a')
    link.download = `${this.data.organization.id}_${this.data.appType}.jpg`
    link.href = canvas.toDataURL()
    link.click()
    document.body.removeChild(link)
  }
}
