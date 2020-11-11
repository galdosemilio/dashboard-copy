import { Component, Inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@coachcare/material'
import { _ } from '@coachcare/backend/shared'
import { NotifierService } from '@coachcare/common/services'
import { ActiveCampaign } from '@coachcare/npm-api'

interface EnrollProviderCampaignDialogData {
  organizationId: string
}

@Component({
  selector: 'ccr-organizations-enroll-provider-campaign-dialog',
  templateUrl: './enroll-provider-campaign.dialog.html',
  styleUrls: ['./enroll-provider-campaign.dialog.scss'],
  host: { class: 'ccr-dialog' }
})
export class EnrollProviderCampaignDialogComponent implements OnInit {
  public form: FormGroup
  public isLoading: boolean
  public organizationId: string
  public provider: string

  constructor(
    private activeCampaign: ActiveCampaign,
    @Inject(MAT_DIALOG_DATA) private data: EnrollProviderCampaignDialogData,
    private dialogRef: MatDialogRef<EnrollProviderCampaignDialogComponent>,
    private fb: FormBuilder,
    private notifier: NotifierService
  ) {}

  public ngOnInit(): void {
    this.organizationId = this.data.organizationId
    this.createForm()
  }

  public onProviderSelect($event: any): void {
    this.form.patchValue({ provider: $event.id })
    this.provider = `${$event.firstName} ${$event.lastName}`
  }

  public async onSubmit(): Promise<void> {
    try {
      this.isLoading = true
      const formValue = this.form.value

      await this.activeCampaign.createNewsletterSubscription({
        account: formValue.provider,
        organization: this.organizationId
      })

      this.notifier.success(
        _('NOTIFY.SUCCESS.PROVIDER_ASSOCIATED_ACTIVE_CAMPAIGN_LIST')
      )
      this.dialogRef.close(true)
    } catch (error) {
      this.notifier.error(error)
    } finally {
      this.isLoading = false
    }
  }

  private createForm(): void {
    this.form = this.fb.group({
      provider: ['', Validators.required]
    })
  }
}
