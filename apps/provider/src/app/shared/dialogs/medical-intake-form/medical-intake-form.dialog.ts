import { Component, HostListener, OnInit } from '@angular/core'
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'
import { MatDialogRef } from '@coachcare/material'
import { environment } from 'apps/provider/src/environments/environment'

@Component({
  selector: 'ccr-medical-intake-form-dialog',
  templateUrl: './medical-intake-form.dialog.html',
  styleUrls: ['./medical-intake-form.dialog.scss'],
  host: { class: 'ccr-dialog' }
})
export class MedicalIntakeFormDialog implements OnInit {
  @HostListener('window:message', ['$event'])
  onThankYouMessage(message: MessageEvent): void {
    if (message.data.type === 'ccr-thank-you-screen') {
      this.dialogRef.close()
    }
  }

  public baseUrl: string = environment.loginSite

  public url: SafeUrl

  constructor(
    private dialogRef: MatDialogRef<MedicalIntakeFormDialog>,
    private domSanitizer: DomSanitizer
  ) {}

  public ngOnInit(): void {
    this.url = this.domSanitizer.bypassSecurityTrustResourceUrl(
      this.baseUrl + '/wellcore/medical-intake-form'
    )
  }
}
