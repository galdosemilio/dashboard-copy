import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrganizationPreference, OrganizationPreferenceSingle } from '@coachcare/backend/services';
import { _ } from '@coachcare/backend/shared';
import { NotifierService } from '@coachcare/common/services';

@Component({
  selector: 'ccr-organizations-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.scss']
})
export class BasicInfoComponent implements OnInit {
  @Input() orgId: string;
  @Input() prefs: OrganizationPreferenceSingle;

  public form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private notifier: NotifierService,
    private organizationPreference: OrganizationPreference
  ) {}

  public ngOnInit(): void {
    this.createForm();
  }

  public async onSubmit(): Promise<void> {
    try {
      if (this.form.invalid) {
        this.form.patchValue(this.prefs);
        return;
      }

      const formValue = this.form.value;
      await this.organizationPreference.update({
        id: this.orgId,
        displayName: formValue.displayName
      });
      this.notifier.success(_('NOTIFY.SUCCESS.SETTINGS_UPDATED'));
    } catch (error) {
      this.notifier.error(error);
    }
  }

  private createForm(): void {
    this.form = this.fb.group({
      displayName: ['', Validators.required]
    });

    if (this.prefs) {
      this.form.patchValue(this.prefs);
    }
  }
}
