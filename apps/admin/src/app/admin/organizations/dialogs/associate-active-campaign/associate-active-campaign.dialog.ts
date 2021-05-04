import { Component, Inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@coachcare/material'
import { ActiveCampaign, NamedEntity } from '@coachcare/sdk'
import { _ } from '@coachcare/backend/shared'
import { NotifierService } from '@coachcare/common/services'

export interface AssociateActiveCampaignDialogData {
  organizationId: string
}

@Component({
  selector: 'ccr-organizations-associate-active-campaign-dialog',
  templateUrl: './associate-active-campaign.dialog.html',
  styleUrls: ['./associate-active-campaign.dialog.scss'],
  host: { class: 'ccr-dialog' }
})
export class AssociateActiveCampaignDialogComponent implements OnInit {
  public activeCampaigns: NamedEntity[] = []
  public form: FormGroup
  public isLoading = true

  constructor(
    private activeCampaign: ActiveCampaign,
    @Inject(MAT_DIALOG_DATA) private data: AssociateActiveCampaignDialogData,
    private dialogRef: MatDialogRef<AssociateActiveCampaignDialogComponent>,
    private fb: FormBuilder,
    private notifier: NotifierService
  ) {}

  public ngOnInit(): void {
    this.createForm()
    this.fetchActiveCampaigns()
  }

  public async onSubmit(): Promise<void> {
    try {
      const formValue = this.form.value
      const selectedCampaign = this.activeCampaigns.find(
        (campaign) => campaign.id === formValue.campaign
      )

      if (!selectedCampaign) {
        return
      }

      await this.activeCampaign.createListAssociation({
        list: { id: selectedCampaign.id, name: selectedCampaign.name },
        organization: this.data.organizationId
      })

      this.notifier.success(
        _('NOTIFY.SUCCESS.ACTIVE_CAMPAIGN_LIST_ASSOCIATION_CREATED')
      )
      this.dialogRef.close(true)
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private createForm(): void {
    this.form = this.fb.group({
      campaign: ['', Validators.required]
    })
  }

  private async fetchActiveCampaigns(): Promise<void> {
    try {
      this.isLoading = true
      const campaigns = (await this.activeCampaign.getLists()).data
      this.activeCampaigns = campaigns || []

      if (!this.activeCampaigns.length) {
        return
      }

      this.form.patchValue({ campaign: this.activeCampaigns[0].id })
    } catch (error) {
      this.notifier.error(error)
    } finally {
      this.isLoading = false
    }
  }
}
