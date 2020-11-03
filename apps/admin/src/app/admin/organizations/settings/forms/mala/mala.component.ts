import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { OrganizationPreference } from '@coachcare/npm-api'
import { _, FormUtils } from '@coachcare/backend/shared'
import { NotifierService } from '@coachcare/common/services'

@Component({
  selector: 'ccr-organizations-mala',
  templateUrl: './mala.component.html'
})
export class MALAComponent implements OnInit {
  @Input() adminPrefs: any
  @Input() orgId: string

  @Output() adminPrefsChange: EventEmitter<any> = new EventEmitter<any>()

  public form: FormGroup

  constructor(
    private fb: FormBuilder,
    private notifier: NotifierService,
    private organizationPreference: OrganizationPreference
  ) {}

  public ngOnInit(): void {
    this.createForm()
    if (this.adminPrefs && this.adminPrefs.mala) {
      this.form.patchValue(this.adminPrefs.mala)
    }
  }

  public async onSubmit(): Promise<void> {
    try {
      const formValue = this.form.value
      await this.organizationPreference.updateAdminPreference({
        id: this.orgId,
        mala: FormUtils.pruneEmpty(formValue)
      })
      this.notifier.success(_('NOTIFY.SUCCESS.SETTINGS_UPDATED'))

      this.adminPrefsChange.emit({ mala: formValue })
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private createForm(): void {
    this.form = this.fb.group({
      appName: [''],
      iosBundleId: [''],
      androidBundleId: [''],
      firebaseProjectName: [''],
      appStoreConnectTeamId: [''],
      developerPortalTeamId: ['']
    })
  }
}
