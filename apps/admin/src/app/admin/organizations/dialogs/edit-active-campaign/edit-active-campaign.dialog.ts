import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@coachcare/layout';
import { ActiveCampaignListItem } from '@coachcare/backend/data';
import { _ } from '@coachcare/backend/shared';
import { NotifierService } from '@coachcare/common/services';
import { ActiveCampaign } from 'selvera-api';

export interface EditActiveCampaignDialogData {
  activeCampaign: ActiveCampaignListItem;
}

@Component({
  selector: 'ccr-organizations-edit-active-campaign-dialog',
  templateUrl: './edit-active-campaign.dialog.html',
  styleUrls: ['./edit-active-campaign.dialog.scss'],
  host: { class: 'ccr-dialog' }
})
export class EditActiveCampaignDialogComponent implements OnInit {
  public form: FormGroup;

  constructor(
    private activeCampaign: ActiveCampaign,
    @Inject(MAT_DIALOG_DATA) private data: EditActiveCampaignDialogData,
    private dialogRef: MatDialogRef<EditActiveCampaignDialogComponent>,
    private fb: FormBuilder,
    private notifier: NotifierService
  ) {}

  public ngOnInit(): void {
    this.createForm();
  }

  public async onSubmit(): Promise<void> {
    try {
      const formValue = this.form.value;
      await this.activeCampaign.updateListAssociation({
        id: this.data.activeCampaign.id,
        isActive: formValue.isActive,
        list: {
          name: formValue.name
        }
      });
      this.notifier.success(_('NOTIFY.SUCCESS.ACTIVE_CAMPAIGN_UPDATED'));
      this.dialogRef.close(true);
    } catch (error) {
      this.notifier.error(error);
    }
  }

  private createForm(): void {
    this.form = this.fb.group({
      description: [''],
      name: ['', Validators.required],
      isActive: [false, Validators.required]
    });

    this.form.patchValue({
      name: this.data.activeCampaign.name,
      isActive: this.data.activeCampaign.isActive
    });
  }
}
