import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { ContextService, NotifierService } from '@app/service'
import { _ } from '@app/shared/utils'
import { MessagingPreference } from '@coachcare/sdk'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { debounceTime } from 'rxjs/operators'

interface FeaturePreferences {
  messaging: any
}

@UntilDestroy()
@Component({
  selector: 'app-clinic-settings',
  styleUrls: ['./clinic-settings.component.scss'],
  templateUrl: './clinic-settings.component.html'
})
export class ClinicSettingsComponent implements OnDestroy, OnInit {
  public colSpan = 1
  public form: FormGroup
  public isAdmin: boolean
  public isInherited = false
  public isLoading = false
  public messagePreferenceId: string
  public autoThreadParticipationEnabled = false
  public organizationId: string
  public organizationName: string

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
    void this.resolveAdminPerm()
    void this.fetchOrganizationPreferences()
  }

  private createForm(): void {
    this.form = this.fb.group({
      useAutoThreadParticipation: [null]
    })
  }

  private async fetchOrganizationPreferences(): Promise<void> {
    try {
      this.organizationId = this.context.clinic.id
      this.organizationName = this.context.clinic.name

      const preferences = await this.messagingPreference.getOrgPreference({
        organization: this.context.clinic.id
      })

      this.featurePreferences = {
        messaging: preferences
      }

      this.isInherited = preferences.organization.id !== this.context.clinic.id
      this.autoThreadParticipationEnabled =
        !this.isInherited &&
        this.featurePreferences.messaging.useAutoThreadParticipation
          ? true
          : false
      this.messagePreferenceId = this.featurePreferences.messaging.id

      this.form.patchValue(
        {
          useAutoThreadParticipation: this.autoThreadParticipationEnabled
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

      this.isLoading = true

      // If we are updating the existing preference
      if (!this.isInherited && this.featurePreferences.messaging) {
        await this.messagingPreference.updateOrgPreference({
          id: this.featurePreferences.messaging.id,
          useAutoThreadParticipation: formValue.useAutoThreadParticipation,
          isActive: true
        })
        // If we need to create a new preference
      } else {
        const response = await this.messagingPreference.createOrgPreference({
          organization: this.context.clinic.id,
          useAutoThreadParticipation: formValue.useAutoThreadParticipation,
          isActive: true
        })

        this.messagePreferenceId = response.id
      }

      // Update the message preference ID if a new one was created.  Otherwised (on PATCH) just keep the same one
      this.autoThreadParticipationEnabled = formValue.useAutoThreadParticipation
      this.isInherited = false

      this.notifier.success(_('NOTIFY.SUCCESS.UPDATED_PREFERENCE'))
    } catch (error) {
      this.notifier.error(error)
    } finally {
      this.isLoading = false
    }
  }

  private async resolveAdminPerm(): Promise<void> {
    this.isAdmin = await this.context.orgHasPerm(
      this.context.clinic.id,
      'admin'
    )
  }
}
