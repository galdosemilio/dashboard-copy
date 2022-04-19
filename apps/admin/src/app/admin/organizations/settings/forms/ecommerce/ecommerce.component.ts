import { Component, Input, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { NotifierService } from '@coachcare/common/services'
import { _ } from '@coachcare/backend/shared'
import { OrganizationPreference } from '@coachcare/sdk'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { debounceTime } from 'rxjs/operators'

@UntilDestroy()
@Component({
  selector: 'ccr-organizations-ecommerce',
  templateUrl: './ecommerce.component.html'
})
export class OrganizationsEcommerceComponent implements OnInit {
  @Input() orgId: string
  @Input() prefs?: any

  public form: FormGroup

  constructor(
    private fb: FormBuilder,
    private notifier: NotifierService,
    private organizationPref: OrganizationPreference
  ) {
    this.syncOrganizationPrefs = this.syncOrganizationPrefs.bind(this)
  }

  public ngOnInit(): void {
    this.createForm()
  }

  private createForm(): void {
    this.form = this.fb.group({
      spreeUrl: [this.prefs.storeUrl ?? '', [Validators.required]]
    })

    this.form.valueChanges
      .pipe(debounceTime(600), untilDestroyed(this))
      .subscribe(this.syncOrganizationPrefs)
  }

  private async syncOrganizationPrefs(): Promise<void> {
    try {
      if (this.form.invalid) {
        return
      }

      const formValues = this.form.value

      await this.organizationPref.updateAdminPreference({
        id: this.orgId,
        storeUrl: formValues.spreeUrl
      })

      this.notifier.success(_('NOTIFY.SUCCESS.SETTINGS_UPDATED'))
    } catch (error) {
      this.notifier.error(error)
    }
  }
}
