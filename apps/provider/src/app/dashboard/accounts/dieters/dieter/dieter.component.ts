import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core'
import { MatDialog } from '@coachcare/material'
import { ActivatedRoute } from '@angular/router'
import { resolveConfig } from '@app/config/section'
import { ContextService, NotifierService } from '@app/service'
import { RPMPatientReportDialog, _ } from '@app/shared'
import {
  AccountAccessOrganization,
  AccountProvider,
  AccSingleResponse,
  DieterDashboardSummary,
  OrganizationProvider
} from '@coachcare/sdk'
import { get, intersectionBy } from 'lodash'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { DoctorPDFDialog, ProgressReportPDFDialog } from '../../dialogs'
import moment from 'moment-timezone'
import { FormBuilder, FormGroup } from '@angular/forms'
import { CCRConfig } from '@app/config'
import { Store } from '@ngrx/store'
import { FetchSubaccount } from '@app/layout/store/call'
import { PatientProfileLink } from '@app/config/section/models'

@UntilDestroy()
@Component({
  selector: 'app-dieter',
  templateUrl: './dieter.component.html',
  styleUrls: ['./dieter.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DieterComponent implements OnDestroy, OnInit {
  public form: FormGroup
  public dieter: AccSingleResponse
  public patientIsForeign: boolean
  public showDoctorPDFButton: boolean
  public showMessaging: boolean
  public showPatientPDFButton: boolean
  public showCareManagement: boolean
  public automatedTimeTracking: boolean = true
  public timezoneOffset: number
  public timezoneOffsetText: string
  public organizations: AccountAccessOrganization[] = []
  public callUserZendeskLink =
    'https://coachcare.zendesk.com/hc/en-us/articles/360019778772-Video-Conferencing-with-a-Patient'
  public isSwitchingOrg = false
  public patientLinks: PatientProfileLink[] = []

  constructor(
    private account: AccountProvider,
    private builder: FormBuilder,
    private context: ContextService,
    private data: DieterDashboardSummary,
    private dialog: MatDialog,
    private notifier: NotifierService,
    private organization: OrganizationProvider,
    private route: ActivatedRoute,
    private store: Store<CCRConfig>
  ) {}

  public ngOnDestroy(): void {}

  public ngOnInit(): void {
    this.createForm()
    void this.sendWarmupNotification()
    void this.data.init(this.context.accountId)
    void this.route.data.forEach((data: any) => {
      this.dieter = data.account
    })

    this.context.account$
      .pipe(untilDestroyed(this))
      .subscribe(() => this.resolvePatient())

    this.context.automatedTimeTracking$
      .pipe(untilDestroyed(this))
      .subscribe((automatedTimeTracking) => {
        this.automatedTimeTracking = automatedTimeTracking
      })

    this.context.organization$
      .pipe(untilDestroyed(this))
      .subscribe((organization) => {
        this.isSwitchingOrg = false
        this.showDoctorPDFButton = resolveConfig(
          'JOURNAL.SHOW_DOCTOR_PDF_BUTTON',
          organization
        )

        this.showPatientPDFButton = resolveConfig(
          'JOURNAL.SHOW_PATIENT_PDF_BUTTON',
          organization
        )

        this.patientLinks =
          resolveConfig(
            'PATIENT_DASHBOARD.PATIENT_PROFILE_LINKS',
            organization
          ) ?? []

        this.showMessaging = get(
          organization,
          'preferences.messaging.isActive',
          false
        )
        this.showCareManagement =
          !!this.context.accessibleCareManagementServiceTypes.length

        if (
          this.context.activeCareManagementService &&
          !this.context.accessibleCareManagementServiceTypes.find(
            (entry) => entry.id == this.context.activeCareManagementService.id
          )
        ) {
          this.context.activeCareManagementService = undefined
        }

        void this.resolvePatientForeigness()
      })
  }

  private createForm() {
    this.form = this.builder.group({
      organization: []
    })
  }

  public openPatientRpmReportDialog(): void {
    this.dialog.open(RPMPatientReportDialog, { width: '50vw' })
  }

  public onShowDoctorPDFModal(): void {
    this.dialog.open(DoctorPDFDialog)
  }

  public onShowProgressPDFModal(): void {
    this.dialog.open(ProgressReportPDFDialog)
  }

  private async resolvePatientForeigness(): Promise<void> {
    try {
      const descendants = (
        await this.organization.getDescendants({
          organization: this.context.organizationId,
          limit: 'all'
        })
      ).data

      this.organizations = this.context.account.organizations

      const accountOrgsInHierarchy = intersectionBy(
        [this.context.organization, ...descendants],
        this.organizations,
        'id'
      )

      this.patientIsForeign = accountOrgsInHierarchy.length <= 0

      if (this.patientIsForeign) {
        this.form.patchValue({
          organization: this.organizations[0].id
        })
      }
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private resolvePatient() {
    this.checkPatientTimezone()
  }

  private checkPatientTimezone() {
    if (!this.context.account?.timezone || !this.context.user?.timezone) {
      this.timezoneOffset = 0
    }
    const now = moment.utc().unix()
    const offset =
      (moment.tz.zone(this.context.user.timezone).utcOffset(now) -
        moment.tz.zone(this.context.account.timezone).utcOffset(now)) /
      60

    this.timezoneOffset = Math.abs(offset)

    if (offset > 0) {
      this.timezoneOffsetText =
        this.timezoneOffset > 1 ? _('BOARD.HOURS_AHEAD') : _('BOARD.HOUR_AHEAD')
    } else {
      this.timezoneOffsetText =
        this.timezoneOffset > 1
          ? _('BOARD.HOURS_BEHIND')
          : _('BOARD.HOUR_BEHIND')
    }
  }

  private async sendWarmupNotification(): Promise<void> {
    try {
      await this.account.addActivityEvent({
        account: this.context.accountId,
        interaction: {
          time: { instant: moment().toISOString() }
        },
        organization: this.context.organizationId,
        source: 'dashboard',
        tags: ['mobile-app-warmup']
      })
    } catch (error) {
      this.notifier.error(error)
    }
  }

  public onSwitchOrganization(value) {
    const organizationId = this.form.value.organization
    if (this.context.organizationId === organizationId) {
      return
    }

    this.context.organizationId = organizationId
    this.store.dispatch(new FetchSubaccount(organizationId))
    this.isSwitchingOrg = true
  }
}
