import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { ContextService, NotifierService } from '@app/service'
import { _ } from '@app/shared/utils'
import { MessagingPreference } from '@coachcare/npm-api'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { debounceTime } from 'rxjs/operators'

interface FeaturePreferences {
  messaging: any
}

@UntilDestroy()
@Component({
  selector: 'app-clinic-settings',
  templateUrl: './clinic-settings.component.html'
})
export class ClinicSettingsComponent implements OnDestroy, OnInit {
  public colSpan = 1
  public form: FormGroup
  public isInherited = false
  public isLoading = false

  private featurePreferences: FeaturePreferences

  constructor(
    private context: ContextService,
    private fb: FormBuilder,
    private messagingPreference: MessagingPreference,
    private notifier: NotifierService
  ) {
    this.onSubmit = this.onSubmit.bind(this)
  }

  public ngOnDestroy(): void {}

  public ngOnInit(): void {
    this.createForm()
    this.fetchOrganizationPreferences()
  }

  private createForm(): void {
    this.form = this.fb.group({
      useAutoThreadParticipation: [null]
    })
  }

  private async fetchOrganizationPreferences(): Promise<void> {
    try {
      const preferences = await this.messagingPreference.getOrgPreference({
        organization: this.context.clinic.id
      })

      this.featurePreferences = {
        messaging: preferences
      }

      this.isInherited = preferences.organization.id !== this.context.clinic.id

      this.form.patchValue(
        {
          useAutoThreadParticipation: this.featurePreferences.messaging
            .useAutoThreadParticipation
        },
        {
          emitEvent: false
        }
      )

      this.form.valueChanges
        .pipe(untilDestroyed(this), debounceTime(500))
        .subscribe(this.onSubmit)
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private async onSubmit(): Promise<void> {
    try {
      const formValue = this.form.value
      const promises = []

      this.isLoading = true

      promises.push(
        this.featurePreferences.messaging
          ? this.messagingPreference.updateOrgPreference({
              id: this.featurePreferences.messaging.id,
              useAutoThreadParticipation: formValue.useAutoThreadParticipation,
              isActive: true
            })
          : this.messagingPreference.createOrgPreference({
              organization: this.context.clinic.id,
              useAutoThreadParticipation: formValue.useAutoThreadParticipation,
              isActive: true
            })
      )

      await Promise.all(promises)
      this.notifier.success(_('NOTIFY.SUCCESS.UPDATED_PREFERENCE'))
    } catch (error) {
      this.notifier.error(error)
    } finally {
      this.isLoading = false
    }
  }
}
