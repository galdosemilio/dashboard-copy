import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import {
  CommunicationPreference,
  ContentPreference,
  MessagingPreference,
  OrganizationProvider,
  OrganizationPreference,
  Sequence,
  NamedEntity,
  AccountTypeIds,
  Entity
} from '@coachcare/sdk'
import { _ } from '@coachcare/backend/shared'
import { BINDFORM_TOKEN } from '@coachcare/common/directives'
import { NotifierService } from '@coachcare/common/services'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { debounceTime } from 'rxjs/operators'
import { environment } from '../../../../../../environments/environment'
import { get } from 'lodash'

interface FeatureSettingsEntry {
  isInheritable: boolean
  inheritedFrom?: NamedEntity
  prefRoute: string
  isConfigureOption?: boolean
}

@UntilDestroy()
@Component({
  selector: 'ccr-organizations-features',
  templateUrl: './features.component.html',
  providers: [
    {
      provide: BINDFORM_TOKEN,
      useExisting: forwardRef(() => FeaturesComponent)
    }
  ]
})
export class FeaturesComponent implements OnDestroy, OnInit {
  @Input() featurePrefs: any
  @Input() orgId: string
  @Input() prefs: any

  public clientPackages: any[] = []
  public disabledAutothread: boolean
  public form: FormGroup
  public featureSettings: { [key: string]: FeatureSettingsEntry } = {
    videoConference: {
      isInheritable: true,
      prefRoute: 'communicationPrefs'
    },
    digitalLibrary: {
      isInheritable: true,
      prefRoute: 'contentPrefs'
    },
    messaging: {
      isInheritable: true,
      prefRoute: 'messagingPrefs'
    },
    useAutoThreadParticipation: {
      isInheritable: false,
      prefRoute: 'messagingPrefs'
    },
    openAddClient: {
      isInheritable: true,
      prefRoute: 'openAddClient'
    },
    patientAutoUnenroll: {
      isInheritable: false,
      prefRoute: 'patientAutoUnenroll'
    },
    sequences: {
      isInheritable: true,
      prefRoute: 'sequencePrefs'
    },
    fileVault: {
      isInheritable: true,
      prefRoute: 'fileVaultPrefs'
    },
    removeEnrollmentsOnAssoc: {
      isInheritable: false,
      prefRoute: 'removeEnrollmentsOnAssoc'
    },
    autoEnroll: {
      isInheritable: false,
      prefRoute: 'autoEnroll'
    },
    schedule: {
      isInheritable: true,
      isConfigureOption: true,
      prefRoute: 'schedulePrefs'
    },
    scheduleIsPrimary: {
      isInheritable: false,
      prefRoute: 'scheduleIsPrimary'
    },
    scheduleEnabledProviders: {
      isInheritable: false,
      prefRoute: 'scheduleEnabledProviders'
    },
    scheduleEnabledPatients: {
      isInheritable: false,
      prefRoute: 'scheduleEnabledPatients'
    },
    scheduleAddressEnabled: {
      isInheritable: false,
      prefRoute: 'scheduleAddressEnabled'
    }
  }

  private readonly inheritedFromString = _('GLOBAL.INHERITED_FROM')

  constructor(
    private communicationPrefs: CommunicationPreference,
    private contentPrefs: ContentPreference,
    private fb: FormBuilder,
    private messagingPref: MessagingPreference,
    private notifier: NotifierService,
    private organization: OrganizationProvider,
    private organizationPreference: OrganizationPreference,
    private sequence: Sequence
  ) {}

  public ngOnDestroy(): void {}

  public ngOnInit(): void {
    this.createForm()

    this.disabledAutothread =
      environment.ccrApiEnv === 'prod'
        ? this.orgId === '3637'
          ? true
          : false
        : this.orgId === '30'
        ? true
        : false
  }

  private async onSubmit(): Promise<void> {
    try {
      const formValue = this.form.value
      const promises: Promise<any>[] = []

      promises.push(
        this.organizationPreference.update({
          id: this.orgId,
          onboarding: formValue.autoEnroll
            ? {
                client: {
                  packages: formValue.autoEnrollClientLabelId.value
                    ? formValue.autoEnrollClientLabelId.value
                    : []
                }
              }
            : { client: { packages: [] } },
          openAssociation:
            formValue.openAddClient !== null
              ? { client: formValue.openAddClient }
              : { client: null }
        })
      )

      promises.push(
        this.organization.update({
          id: this.orgId,
          automaticDisassociation: {
            client: formValue.patientAutoUnenroll || false
          },
          removeEnrollmentsOnAssociation:
            formValue.removeEnrollmentsOnAssoc || false
        })
      )

      promises.push(
        formValue.content === null
          ? this.featurePrefs.contentPrefs &&
            this.featurePrefs.contentPrefs.organization.id === this.orgId
            ? this.contentPrefs.deleteContentPreference({
                organization: this.orgId || ''
              })
            : Promise.resolve()
          : this.contentPrefs.upsertContentPreference({
              organization: this.orgId || '',
              isActive: formValue.content
            })
      )

      promises.push(
        formValue.fileVault === null
          ? this.featurePrefs.fileVaultPrefs &&
            this.featurePrefs.fileVaultPrefs.organization.id === this.orgId
            ? this.contentPrefs.deleteContentVaultPreference({
                organization: this.orgId || ''
              })
            : Promise.resolve()
          : this.contentPrefs.upsertContentVaultPreference({
              organization: this.orgId || '',
              isActive: formValue.fileVault
            })
      )

      promises.push(
        (this.featurePrefs.messagingPrefs &&
        this.featurePrefs.messagingPrefs.organization.id === this.orgId
          ? formValue.messaging === null
            ? this.messagingPref.deleteMessagePreference({
                id: this.featurePrefs.messagingPrefs.id
              })
            : this.messagingPref.updatePreference({
                id: this.featurePrefs.messagingPrefs.id,
                isActive: formValue.messaging,
                useAutoThreadParticipation: formValue.useAutoThreadParticipation
              })
          : formValue.messaging !== null &&
            this.messagingPref.createPreference({
              isActive: formValue.messaging,
              useAutoThreadParticipation: formValue.useAutoThreadParticipation,
              organization: this.orgId || ''
            })) || Promise.resolve()
      )

      promises.push(
        this.featurePrefs.sequencePrefs &&
          this.featurePrefs.sequencePrefs.organization.id === this.orgId
          ? formValue.sequences === null
            ? this.sequence.deleteSeqOrgPreference({
                id: this.featurePrefs.sequencePrefs.id
              })
            : this.sequence.updateSeqOrgPreference({
                id: this.featurePrefs.sequencePrefs.id,
                isActive: formValue.sequences
              })
          : (formValue.sequences !== null &&
              this.sequence.createSeqOrgPreference({
                isActive: formValue.sequences,
                organization: this.orgId || ''
              })) ||
              Promise.resolve()
      )

      promises.push(
        (this.featurePrefs.communicationPrefs &&
        this.featurePrefs.communicationPrefs.organization.id === this.orgId
          ? formValue.videoconference === null
            ? this.communicationPrefs.deletePreference({
                id: this.featurePrefs.communicationPrefs.id
              })
            : this.communicationPrefs.updatePreference({
                id: this.featurePrefs.communicationPrefs.id,
                videoConferencing: { isEnabled: formValue.videoconference },
                recording: {
                  isEnabled: formValue.videoconferenceRecording ?? false
                }
              })
          : formValue.videoconference !== null &&
            this.communicationPrefs.createPreference({
              organization: this.orgId || '',
              videoConferencing: { isEnabled: formValue.videoconference },
              recording: {
                isEnabled: formValue.videoconferenceRecording ?? false
              }
            })) || Promise.resolve()
      )

      const scheduleDisabled = []

      if (!formValue.scheduleEnabledProviders) {
        scheduleDisabled.push(AccountTypeIds.Provider)
      }

      if (!formValue.scheduleEnabledPatients) {
        scheduleDisabled.push(AccountTypeIds.Client)
      }

      promises.push(
        this.featurePrefs.schedulePrefs &&
          this.featurePrefs.schedulePrefs.id === this.orgId
          ? formValue.schedule === null
            ? this.organization.deleteSchedulePreference(this.orgId)
            : this.organization.updateSchedulePreference({
                organization: this.orgId,
                disabledFor: scheduleDisabled,
                isPrimary: formValue.scheduleIsPrimary,
                address: {
                  display: {
                    enabled: formValue.scheduleAddressEnabled
                  }
                }
              })
          : formValue.schedule !== null
          ? this.organization.createSchedulePreference({
              organization: this.orgId,
              disabledFor: scheduleDisabled,
              isPrimary: formValue.scheduleIsPrimary,
              address: {
                display: {
                  enabled: formValue.scheduleAddressEnabled
                }
              }
            })
          : Promise.resolve()
      )

      const promiseValues = await Promise.all(promises)

      this.refreshFeaturePrefsObject(
        formValue.fileVault,
        promiseValues[3],
        'fileVaultPrefs'
      )
      this.refreshFeaturePrefsObject(
        formValue.messaging,
        promiseValues[4],
        'messagingPrefs'
      )
      this.refreshFeaturePrefsObject(
        formValue.sequences,
        promiseValues[5],
        'sequencePrefs'
      )
      this.refreshFeaturePrefsObject(
        formValue.videoconference,
        promiseValues[6],
        'communicationPrefs'
      )

      this.refreshFeaturePrefsObject(
        formValue.schedule,
        promiseValues[7],
        'schedulePrefs'
      )

      this.refreshFeatureSettingsObject()

      this.notifier.success(_('NOTIFY.SUCCESS.SETTINGS_UPDATED'))
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private createForm(): void {
    this.form = this.fb.group({
      autoEnroll: [null],
      content: [null],
      fileVault: [null],
      messaging: [null],
      openAddClient: [null],
      openAddProvider: [null],
      patientAutoUnenroll: [null],
      removeEnrollmentsOnAssoc: [null],
      sequences: [null],
      useAutoThreadParticipation: [null],
      videoconference: [null],
      videoconferenceRecording: [null],
      schedule: [null],
      scheduleIsPrimary: [null],
      scheduleEnabledProviders: [null],
      scheduleEnabledPatients: [null],
      scheduleAddressEnabled: [null]
    })

    if (this.featurePrefs) {
      this.clientPackages =
        this.featurePrefs.onboarding && this.featurePrefs.onboarding.client
          ? [...this.featurePrefs.onboarding.client.packages]
          : []

      this.form.patchValue({
        content:
          this.featurePrefs.contentPrefs &&
          this.featurePrefs.contentPrefs.organization.id === this.orgId
            ? this.featurePrefs.contentPrefs.isActive
            : null,
        fileVault: this.featurePrefs.fileVaultPrefs
          ? this.featurePrefs.fileVaultPrefs.isActive
          : null,
        openAddClient:
          this.prefs.openAssociation && this.prefs.openAssociation !== null
            ? this.prefs.openAssociation.client
            : null,
        messaging:
          this.featurePrefs.messagingPrefs &&
          this.featurePrefs.messagingPrefs.organization.id === this.orgId
            ? this.featurePrefs.messagingPrefs.isActive
            : null,
        useAutoThreadParticipation: this.featurePrefs.messagingPrefs
          ? this.featurePrefs.messagingPrefs.useAutoThreadParticipation
          : false,
        removeEnrollmentsOnAssoc:
          this.featurePrefs.associationPrefs.removeEnrollmentsOnAssociation ??
          false,
        sequences:
          this.featurePrefs.sequencePrefs &&
          this.featurePrefs.sequencePrefs.organization.id === this.orgId
            ? this.featurePrefs.sequencePrefs.isActive
            : null,
        videoconference:
          this.featurePrefs.communicationPrefs &&
          this.featurePrefs.communicationPrefs.organization.id === this.orgId
            ? this.featurePrefs.communicationPrefs.videoConferencing.isEnabled
            : null,
        videoconferenceRecording: this.featurePrefs.communicationPrefs
          ? this.featurePrefs.communicationPrefs.recording.isEnabled
          : false,
        autoEnroll:
          this.featurePrefs.onboarding &&
          this.featurePrefs.onboarding.client &&
          this.featurePrefs.onboarding.client.packages.length
            ? true
            : false,
        autoEnrollClientLabelId: this.clientPackages.slice(),
        patientAutoUnenroll: this.featurePrefs.associationPrefs
          ? this.featurePrefs.associationPrefs.patientAutoUnenroll
          : false,
        schedule:
          this.featurePrefs.schedulePrefs &&
          this.featurePrefs.schedulePrefs.id === this.orgId
            ? true
            : null,
        scheduleIsPrimary:
          this.featurePrefs.schedulePrefs &&
          this.featurePrefs.schedulePrefs.id === this.orgId
            ? this.featurePrefs.schedulePrefs.isPrimary
            : true,
        scheduleEnabledProviders:
          this.featurePrefs.schedulePrefs &&
          this.featurePrefs.schedulePrefs.id === this.orgId
            ? this.featurePrefs.schedulePrefs.disabledFor?.includes(
                AccountTypeIds.Provider
              )
              ? false
              : true
            : true,
        scheduleEnabledPatients:
          this.featurePrefs.schedulePrefs &&
          this.featurePrefs.schedulePrefs.id === this.orgId
            ? this.featurePrefs.schedulePrefs.disabledFor?.includes(
                AccountTypeIds.Client
              )
              ? false
              : true
            : true,
        scheduleAddressEnabled:
          this.featurePrefs.schedulePrefs &&
          this.featurePrefs.schedulePrefs.id === this.orgId
            ? this.featurePrefs.schedulePrefs?.address?.display?.enabled ??
              false
            : true
      })
    }

    this.refreshFeatureSettingsObject()

    setTimeout(
      () =>
        this.form.valueChanges
          .pipe(debounceTime(500), untilDestroyed(this))
          .subscribe(() => this.onSubmit()),
      1000
    )
  }

  private refreshFeaturePrefsObject(
    fieldValue: boolean | null,
    promiseValue: Entity | boolean,
    propertyName: string
  ): void {
    switch (fieldValue) {
      case false:
      case true:
        const promiseValueIsBoolean = typeof promiseValue === 'boolean'

        this.featurePrefs[propertyName] = {
          ...this.featurePrefs[propertyName],
          id:
            propertyName === 'schedulePrefs'
              ? this.orgId
              : promiseValueIsBoolean // this means that we did a PATCH or UPDATE meaning we already have the ID
              ? this.featurePrefs[propertyName]?.id
              : (promiseValue as Entity).id, // this means we ran a CREATE meaning we have to extract the ID from the response
          organization: { id: this.orgId }
        }
        break

      case null:
        this.featurePrefs[propertyName] = undefined
        break

      default:
        break
    }
  }

  private refreshFeatureSettingsObject(): void {
    const updates: { [key: string]: FeatureSettingsEntry } = {}

    Object.keys(this.featureSettings).forEach((key) => {
      const setting = this.featureSettings[key]

      if (!setting.isInheritable) {
        return
      }

      const pref: { id?: string; organization?: NamedEntity } = get(
        this.featurePrefs,
        setting.prefRoute
      )

      if (!pref) {
        return
      }

      const inheritedFrom =
        key === 'schedule'
          ? pref.id !== this.orgId
            ? { id: pref.id, name: '' }
            : null
          : pref.organization?.id !== this.orgId
          ? pref.organization
          : null

      updates[key] = {
        ...setting,
        inheritedFrom
      }
    })

    this.featureSettings = { ...this.featureSettings, ...updates }
  }
}
