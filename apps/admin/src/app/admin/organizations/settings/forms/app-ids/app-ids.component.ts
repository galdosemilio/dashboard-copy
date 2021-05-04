import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { OrganizationPreference } from '@coachcare/sdk'
import { _ } from '@coachcare/backend/shared'
import { NotifierService } from '@coachcare/common/services'

@Component({
  selector: 'ccr-organizations-app-ids',
  templateUrl: './app-ids.component.html'
})
export class AppIdsComponent implements OnDestroy, OnInit {
  @Input() adminPrefs: any
  @Input() orgId: string

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

  public async onSubmit(): Promise<void> {
    try {
      const formValue = this.form.value
      await this.organizationPreference.updateAdminPreference({
        appIds: formValue,
        id: this.orgId
      })
      this.notifier.success(_('NOTIFY.SUCCESS.SETTINGS_UPDATED'))
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private createForm(): void {
    this.form = this.fb.group({
      android: [''],
      ios: ['']
    })

    if (this.adminPrefs && this.adminPrefs.appIds) {
      this.form.patchValue(this.adminPrefs.appIds)
    }
  }
}
