import {
  Component,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { _ } from '@coachcare/backend/shared'
import { BINDFORM_TOKEN } from '@coachcare/common/directives'
import { NotifierService } from '@coachcare/common/services'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { debounceTime } from 'rxjs/operators'
import { MFA } from '@coachcare/sdk'
import { MFAInputComponent } from '../../mfa-input'

@UntilDestroy()
@Component({
  selector: 'ccr-organizations-security',
  templateUrl: './security.component.html',
  providers: [
    {
      provide: BINDFORM_TOKEN,
      useExisting: forwardRef(() => SecurityComponent)
    }
  ]
})
export class SecurityComponent implements OnDestroy, OnInit {
  @Input() orgId: string
  @ViewChild(MFAInputComponent, { static: false })
  mfaInput: MFAInputComponent

  public form: FormGroup

  private firstLoad = false

  constructor(
    private fb: FormBuilder,
    private mfa: MFA,
    private notifier: NotifierService
  ) {}

  public ngOnDestroy(): void {}

  public ngOnInit(): void {
    this.createForm()
  }

  private async onSubmit(): Promise<void> {
    try {
      let existingMfaPref
      let inServerOverride
      const formValue = this.form.value
      const mfaPref = formValue.mfaPref
      const promises: Promise<any>[] = []

      if (mfaPref && mfaPref.mfaInherit) {
        if (mfaPref.mfaPref && mfaPref.mfaPref.organization.id === this.orgId) {
          promises.push(
            this.mfa.deleteOrganizationMFA({
              id: (
                await this.mfa.getOrganizationMFA({
                  organization: this.orgId || '',
                  status: 'all'
                })
              ).id
            })
          )
        }
      } else {
        if (
          mfaPref &&
          mfaPref.mfaPref &&
          mfaPref.mfaPref.organization.id === this.orgId
        ) {
          existingMfaPref = await this.mfa.getOrganizationMFA({
            organization: this.orgId || '',
            status: 'all'
          })
        } else {
          existingMfaPref = await this.mfa.createOrganizationMFA({
            organization: this.orgId || '',
            isActive: mfaPref.mfaEnabled || false
          })
          inServerOverride = false
        }

        if (mfaPref && mfaPref.value) {
          mfaPref.value.forEach((value) => {
            promises.push(
              (
                inServerOverride !== undefined
                  ? inServerOverride
                  : value.inServer
              )
                ? this.mfa.updateMFASection({
                    id: value.id,
                    isRequired: value.isRequired || false,
                    preference: existingMfaPref.id
                  })
                : this.mfa.createMFASection({
                    preference: existingMfaPref.id,
                    accountType: value.accountType.id,
                    isRequired: value.isRequired || false,
                    section: value.section.id
                  })
            )
          })
        }

        promises.push(
          this.mfa.updateOrganizationMFA({
            id: existingMfaPref.id || '',
            isActive: mfaPref.mfaEnabled || false
          })
        )
      }

      await Promise.all(promises)

      this.notifier.success(_('NOTIFY.SUCCESS.SETTINGS_UPDATED'))
      if (this.mfaInput) {
        this.firstLoad = false
        this.mfaInput.reload()
      }
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private createForm(): void {
    this.form = this.fb.group({})

    setTimeout(
      () =>
        this.form.valueChanges
          .pipe(untilDestroyed(this), debounceTime(500))
          .subscribe(() => {
            if (this.firstLoad) {
              this.onSubmit()
            } else {
              this.firstLoad = true
            }
          }),
      1000
    )
  }
}
