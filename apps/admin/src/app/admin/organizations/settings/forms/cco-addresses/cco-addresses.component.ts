import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import {
  OrganizationPreference,
  OrganizationPreferenceSingle
} from '@coachcare/npm-api'
import { _ } from '@coachcare/backend/shared'
import { NotifierService } from '@coachcare/common/services'
import { untilDestroyed } from 'ngx-take-until-destroy'

@Component({
  selector: 'ccr-organizations-cco-addresses',
  templateUrl: './cco-addresses.component.html'
})
export class CcoAddressesComponent implements OnDestroy, OnInit {
  @Input() orgId: string
  @Input() prefs: OrganizationPreferenceSingle

  public form: FormGroup

  constructor(
    private fb: FormBuilder,
    private notifier: NotifierService,
    private organizationPreference: OrganizationPreference
  ) {}

  public ngOnDestroy(): void {}

  public ngOnInit(): void {
    this.createForm()
  }

  private createForm(): void {
    this.form = this.fb.group({ bccEmails: [''] })
    this.form.patchValue(this.prefs)

    this.form.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe(() => this.onSubmit())
  }

  private async onSubmit(): Promise<void> {
    try {
      if (this.form.invalid) {
        this.form.patchValue(this.prefs)
        return
      }

      const formValue = this.form.value

      await this.organizationPreference.update({
        id: this.orgId,
        bccEmails: formValue.bccEmails
      } as any)
      this.notifier.success(_('NOTIFY.SUCCESS.SETTINGS_UPDATED'))
    } catch (error) {
      this.notifier.error(error)
    }
  }
}
