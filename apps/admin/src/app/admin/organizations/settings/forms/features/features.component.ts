import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import {
  CommunicationPreference,
  ContentPreference,
  MessagingPreference,
  OrganizationProvider,
  OrganizationPreference,
  RPM,
  Sequence,
  NamedEntity
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
    rpm: {
      isInheritable: true,
      prefRoute: 'rpmPrefs'
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
    private rpm: RPM,
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
                videoConferencing: { isEnabled: formValue.videoconference }
              })
          : formValue.videoconference !== null &&
            this.communicationPrefs.createPreference({
              organization: this.orgId || '',
              videoConferencing: { isEnabled: formValue.videoconference }
            })) || Promise.resolve()
      )

      promises.push(
        this.featurePrefs.rpmPrefs &&
          this.featurePrefs.rpmPrefs.organization.id === this.orgId
          ? formValue.rpm === null
            ? this.rpm.deleteRPMPreference({
                id: this.featurePrefs.rpmPrefs.id
              })
            : this.rpm.updateRPMPreference({
                id: this.featurePrefs.rpmPrefs.id,
                isActive: formValue.rpm
              })
          : formValue.rpm !== null
          ? this.rpm.createRPMPreference({
              organization: this.orgId || '',
              isActive: formValue.rpm
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
        formValue.rpm,
        promiseValues[7],
        'rpmPrefs'
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
      rpm: [null],
      sequences: [null],
      useAutoThreadParticipation: [null],
      videoconference: [null]
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
        rpm:
          this.featurePrefs.rpmPrefs &&
          this.featurePrefs.rpmPrefs.organization.id === this.orgId
            ? this.featurePrefs.rpmPrefs.isActive
            : null,
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
        autoEnroll:
          this.featurePrefs.onboarding &&
          this.featurePrefs.onboarding.client &&
          this.featurePrefs.onboarding.client.packages.length
            ? true
            : false,
        autoEnrollClientLabelId: this.clientPackages.slice(),
        patientAutoUnenroll: this.featurePrefs.associationPrefs
          ? this.featurePrefs.associationPrefs.patientAutoUnenroll
          : false
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
    promiseValue: any,
    propertyName: string
  ): void {
    switch (fieldValue) {
      case false:
      case true:
        this.featurePrefs[propertyName] = {
          ...this.featurePrefs[propertyName],
          ...promiseValue,
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

      const pref: { organization?: NamedEntity } = get(
        this.featurePrefs,
        setting.prefRoute
      )

      if (!pref) {
        return
      }

      updates[key] = {
        ...setting,
        inheritedFrom:
          pref.organization?.id !== this.orgId ? pref.organization : null
      }
    })

    this.featureSettings = { ...this.featureSettings, ...updates }
  }
}
