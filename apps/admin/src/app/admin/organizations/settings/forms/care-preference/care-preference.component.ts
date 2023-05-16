import { Component, forwardRef, Input, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { CareManagementPreference, Entity } from '@coachcare/sdk'
import { _ } from '@coachcare/backend/shared'
import { BINDFORM_TOKEN } from '@coachcare/common/directives'
import {
  CareManagementFeaturePref,
  NotifierService
} from '@coachcare/common/services'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { debounceTime, Subject } from 'rxjs'

@UntilDestroy()
@Component({
  selector: 'ccr-care-preference',
  templateUrl: './care-preference.component.html',
  providers: [
    {
      provide: BINDFORM_TOKEN,
      useExisting: forwardRef(() => CarePreferenceComponent)
    }
  ]
})
export class CarePreferenceComponent implements OnInit {
  @Input() orgId: string
  @Input()
  set pref(carePref: CareManagementFeaturePref) {
    this._carePref = carePref
  }

  get pref(): CareManagementFeaturePref {
    return this._carePref
  }

  public form: FormGroup
  private _carePref: CareManagementFeaturePref
  private carePref$ = new Subject<CareManagementFeaturePref>()
  public inheritedOrg: Entity
  public inherited: boolean = true

  constructor(
    private carePreference: CareManagementPreference,
    private notifier: NotifierService,
    private fb: FormBuilder
  ) {}

  public ngOnInit(): void {
    this.createForm()
    this.patchValues()
    this.carePref$.pipe(untilDestroyed(this)).subscribe((pref) => {
      this._carePref = pref
      this.patchValues()
    })
    this.form.valueChanges
      .pipe(untilDestroyed(this), debounceTime(500))
      .subscribe(() => this.onSubmit())
  }

  private async onSubmit() {
    const { active, deviceSetupNotification } = this.form.value
    const deviceSetupNotificationValue =
      deviceSetupNotification === false ? 'disabled' : 'enabled'

    try {
      if (active === 'inherit') {
        if (
          !this.pref.preference ||
          this.pref.preference.organization.id !== this.orgId
        ) {
          return
        }

        await this.carePreference.deleteCareManagementPreference(
          this.pref.preference.id
        )
      } else {
        if (
          !this.pref.preference ||
          this.pref.preference.organization.id !== this.orgId
        ) {
          await this.carePreference.createCareManagementPreference({
            organization: this.orgId,
            isActive: active,
            serviceType: this.pref.serviceType.id,
            deviceSetupNotification: deviceSetupNotificationValue
          })
        } else {
          await this.carePreference.updateCareManagementPreference({
            id: this.pref.preference.id,
            isActive: active,
            deviceSetupNotification: deviceSetupNotificationValue
          })
        }
      }

      await this.resolveCarePreference()
      this.notifier.success(_('NOTIFY.SUCCESS.SETTINGS_UPDATED'))
    } catch (error) {
      this.notifier.error(error)
      this.carePref$.next(this.pref)
    }
  }

  private async resolveCarePreference() {
    const res = await this.carePreference.getAllCareManagementPreferences({
      organization: this.orgId,
      serviceType: this.pref.serviceType.id
    })

    this.carePref$.next({
      serviceType: this.pref.serviceType,
      preference: res.data[0]
    })
  }

  private createForm(): void {
    this.form = this.fb.group({
      active: ['inherit'],
      deviceSetupNotification: [true]
    })
  }

  private patchValues(): void {
    this.inheritedOrg =
      this.pref.preference?.organization.id === this.orgId
        ? null
        : this.pref.preference?.organization
    this.form.patchValue(
      {
        active:
          this.pref.preference &&
          this.pref.preference.organization.id === this.orgId
            ? this.pref.preference.isActive
            : 'inherit',
        deviceSetupNotification: this.pref.preference?.deviceSetupNotification
          ? this.pref.preference?.deviceSetupNotification === 'enabled'
          : true
      },
      { emitEvent: false }
    )

    if (this.inheritedOrg) {
      this.form.controls.deviceSetupNotification.disable({ emitEvent: false })
    } else {
      this.form.controls.deviceSetupNotification.enable({ emitEvent: false })
    }
  }
}
