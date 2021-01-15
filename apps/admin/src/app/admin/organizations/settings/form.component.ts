import {
  Component,
  forwardRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import {
  OrganizationFeaturePrefs,
  OrganizationParams,
  OrganizationRoutes
} from '@board/services'
import {
  OrganizationPreference,
  OrganizationPreferenceSingle,
  OrganizationSingle
} from '@coachcare/npm-api'
import { _, FormUtils } from '@coachcare/backend/shared'
import { BINDFORM_TOKEN } from '@coachcare/common/directives'
import { NotifierService } from '@coachcare/common/services'
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor'
import * as lodash from 'lodash'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { debounceTime } from 'rxjs/operators'

@UntilDestroy()
@Component({
  selector: 'ccr-organizations-settings',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: BINDFORM_TOKEN,
      useExisting: forwardRef(() => OrganizationsSettingsComponent)
    }
  ]
})
export class OrganizationsSettingsComponent implements OnDestroy, OnInit {
  @ViewChild(JsonEditorComponent, { static: false })
  editor: JsonEditorComponent

  colSpan = 3
  clientPackages: any[]
  editorOptions: JsonEditorOptions
  form: FormGroup
  featurePrefs: OrganizationFeaturePrefs
  iconUrl: string | undefined
  id: string | undefined
  initialPreference: any
  initialAdminPreference: any
  initialJsonEditor: any
  item: OrganizationSingle | undefined
  logoUrl: string | undefined
  readonly = false
  reactiveControls = ['security']
  splashUrl: string | undefined
  section: 'core' | 'visual' | 'mala' | 'features' | 'security' = 'core'

  private firstLoadPassed = false

  constructor(
    public routes: OrganizationRoutes,
    private builder: FormBuilder,
    private notifier: NotifierService,
    private organizationPreference: OrganizationPreference,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.editorOptions = new JsonEditorOptions()
    this.editorOptions.name = 'Other'
  }

  public ngOnDestroy(): void {}

  public ngOnInit() {
    // route parameters
    this.route.data.subscribe(async (data: OrganizationParams) => {
      this.item = data.org
      this.id = data.org ? data.org.id : undefined
      const prefs: OrganizationPreferenceSingle | undefined = data.prefs
      const featurePrefs: OrganizationFeaturePrefs | undefined =
        data.featurePrefs
      // setup the FormGroup
      this.createPreferencesFrom()

      let onboarding

      if (prefs) {
        this.logoUrl = prefs.assets ? prefs.assets.logoUrl : undefined
        this.splashUrl = prefs.assets ? prefs.assets.splashUrl : undefined
        this.iconUrl = prefs.assets ? prefs.assets.iconUrl : undefined

        const logoFilename = this.logoUrl ? this.logoUrl.split('/').pop() : ''
        const iconFilename = this.iconUrl ? this.iconUrl.split('/').pop() : ''
        const splashFilename = this.splashUrl
          ? this.splashUrl.split('/').pop()
          : ''
        // reformat the preferences to fill the form
        const { mala, appIds, ...rset } = prefs
        onboarding = rset.onboarding
        this.clientPackages =
          onboarding && onboarding.client ? [...onboarding.client.packages] : []
        const { displayName, id, bccEmails } = rset

        if (this.id !== id) {
          this.organizationPreference.create({
            id: this.id || ''
          })
        }

        this.initialPreference = FormUtils.pruneEmpty(
          {
            id: this.id,
            displayName,
            logoFilename,
            logoUrl: this.logoUrl,
            splashUrl: this.splashUrl,
            iconUrl: this.iconUrl,
            iconFilename,
            splashFilename,
            color: prefs.assets ? prefs.assets.color : {},
            bccEmails,
            autoEnrollClientLabelId: this.clientPackages.slice(),
            openAssociation: rset.openAssociation,
            clinicCodeHelp: rset.clinicCodeHelp,
            useActiveCampaign: rset.useActiveCampaign
          },
          ['bccEmails']
        )
        const {
          androidBundleId = '',
          appName = '',
          appStoreConnectTeamId = '',
          developerPortalTeamId = '',
          firebaseProjectName = '',
          iosBundleId = '',
          ...other
        } = mala

        this.initialJsonEditor = other

        this.initialAdminPreference = FormUtils.pruneEmpty({
          appIds,
          mala: {
            androidBundleId,
            appName,
            appStoreConnectTeamId,
            developerPortalTeamId,
            firebaseProjectName,
            iosBundleId,
            other: { ...other }
          }
        })

        this.form.patchValue({
          ...this.initialPreference,
          ...this.initialAdminPreference
        })
      }

      if (featurePrefs) {
        this.featurePrefs = { ...featurePrefs, onboarding } as any
      }

      this.readonly = false
      this.editorOptions.modes = ['code', 'text', 'tree'] // set all allowed modes
      this.editorOptions.mode = 'tree' // set only one mode

      if (this.readonly) {
        this.reactiveControls.forEach((controlName) => {
          const control = this.form.get(controlName)
          if (control) {
            control.disable()
          }
        })
      } else {
        this.reactiveControls.forEach((controlName) => {
          const control = this.form.get(controlName)
          if (control) {
            control.enable()
          }
        })
      }
    })
  }

  public onChangeJsonEditor(data: any = {}): void {
    if (data.isTrusted !== undefined) {
      return
    }

    const { mala } = this.form.value
    this.form.patchValue({
      mala: {
        ...mala,
        other: {
          ...data
        }
      }
    })
  }

  public async onChangeCodeHelpText(data: any): Promise<void> {
    const helpTextArray = Object.keys(data).map((key) => {
      const codeHelpText = {
        locale: key,
        content: data[key] as string
      }
      return codeHelpText
    })

    try {
      await this.organizationPreference.update({
        id: this.id || '',
        clinicCodeHelp: helpTextArray
      })

      this.notifier.success(_('NOTIFY.SUCCESS.SETTINGS_UPDATED'))
    } catch (error) {
      this.notifier.error(error)
    }
  }

  public onAdminPrefsChange(adminPrefs: any): void {
    const mergedObject = { ...this.initialAdminPreference }
    Object.keys(adminPrefs).forEach((key) => {
      mergedObject[key] = mergedObject[key]
        ? { ...mergedObject[key], ...adminPrefs[key] }
        : adminPrefs[key]
    })

    this.initialAdminPreference = mergedObject
  }

  private createPreferencesFrom(): void {
    // build the form according Create/Update OrganizationPreferenceRequest
    this.form = this.builder.group({
      id: null,
      mala: this.builder.group({
        other: {}
      })
    })

    this.form.valueChanges
      .pipe(debounceTime(1000), untilDestroyed(this))
      .subscribe(() => {
        if (this.firstLoadPassed) {
          this.onUpdate()
        } else {
          this.firstLoadPassed = true
        }
      })
  }

  private async onUpdate(): Promise<void> {
    try {
      if (this.form.valid) {
        const request: any = []
        let { mala } = this.form.value

        mala = {
          ...(this.initialAdminPreference && this.initialAdminPreference.mala
            ? this.initialAdminPreference.mala
            : {}),
          ...mala
        }
        mala.androidBundleId = mala.androidBundleId || null
        mala.appStoreConnectTeamId = mala.appStoreConnectTeamId || null
        mala.developerPortalTeamId = mala.developerPortalTeamId || null
        mala.firebaseProjectName = mala.firebaseProjectName || null
        mala.iosBundleId = mala.iosBundleId || null

        const adminPreference = FormUtils.pruneEmpty(
          {
            mala
          },
          ['appIds', 'mala']
        )

        if (this.form.value.id === this.id) {
          if (
            !lodash.isEqual(this.initialAdminPreference, adminPreference) &&
            !lodash.isEmpty(adminPreference)
          ) {
            request.push(
              this.organizationPreference.updateAdminPreference({
                id: this.id || '',
                ...adminPreference
              })
            )
          }
        } else {
          if (
            !lodash.isEqual(this.initialAdminPreference, adminPreference) &&
            !lodash.isEmpty(adminPreference)
          ) {
            request.push(
              this.organizationPreference.updateAdminPreference({
                id: this.id || '',
                ...adminPreference
              })
            )
          }
        }

        await Promise.all(request)

        this.notifier.success(_('NOTIFY.SUCCESS.SETTINGS_UPDATED'))
        this.router.navigate(['../'], {
          relativeTo: this.route,
          queryParams: { updated: new Date().getTime() }
        })
      } else {
        FormUtils.markAsTouched(this.form)
      }
    } catch (error) {
      this.notifier.error(error)
    }
  }
}
