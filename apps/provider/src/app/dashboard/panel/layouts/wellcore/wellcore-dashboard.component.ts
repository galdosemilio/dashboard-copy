import { Component, OnInit } from '@angular/core'
import {
  ContextService,
  MeasurementLabelService,
  NotifierService,
  SelectedOrganization
} from '@app/service'
import { DateNavigatorOutput } from '@app/shared/components'
import {
  AccountTypeIds,
  FormSubmission,
  MeasurementLabelEntry,
  PackageEnrollment
} from '@coachcare/sdk'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { environment } from 'apps/provider/src/environments/environment'
import { MeetingsDatabase } from '@app/shared/components/schedule'
import { filter } from 'rxjs/operators'

@UntilDestroy()
@Component({
  selector: 'app-wellcore-dashboard',
  templateUrl: './wellcore-dashboard.component.html',
  styleUrls: ['./wellcore-dashboard.component.scss'],
  host: { class: 'wellcore-component' }
})
export class WellcoreDashboardComponent implements OnInit {
  public dates: DateNavigatorOutput = {}
  public submittedMedicalIntakeForm = false
  public hasMeeting = false
  public eligibleToSelfSchedule = false
  public isLoading = false
  public isPatient: boolean
  public medicalIntakeFormLink: string
  public selectedLabel: MeasurementLabelEntry

  constructor(
    private context: ContextService,
    private formSubmission: FormSubmission,
    private measurementLabel: MeasurementLabelService,
    private packageEnrollment: PackageEnrollment,
    private meetingDatabase: MeetingsDatabase,
    private notify: NotifierService
  ) {
    this.resolveFirstLabel = this.resolveFirstLabel.bind(this)
    this.isPatient = this.context.user.accountType.id === AccountTypeIds.Client
    this.medicalIntakeFormLink = `/library/forms/${environment.wellcoreMedicalFormId}/dieter-submissions`
  }

  public ngOnInit(): void {
    this.measurementLabel.loaded$
      .pipe(untilDestroyed(this))
      .subscribe(this.resolveFirstLabel)

    this.context.organization$
      .pipe(untilDestroyed(this))
      .pipe(filter(() => this.isPatient))
      .subscribe((org) => this.loadPatientData(org))
  }

  private async loadPatientData(org: SelectedOrganization): Promise<void> {
    this.isLoading = true

    try {
      this.submittedMedicalIntakeForm =
        await this.checkMedicalIntakeFormSubmission(org)
      this.eligibleToSelfSchedule = await this.checkSelfSchedulingEligibility(
        org
      )
      this.hasMeeting = await this.checkHasMeeting(org)
    } catch (err) {
      this.notify.error(err)
    } finally {
      this.isLoading = false
    }
  }

  private async checkMedicalIntakeFormSubmission(
    org: SelectedOrganization
  ): Promise<boolean> {
    const res = await this.formSubmission.getAll({
      form: environment.wellcoreMedicalFormId,
      account: this.context.user.id,
      limit: 1,
      organization: org.id
    })

    return res.data.length >= 1
  }

  private async checkSelfSchedulingEligibility(
    org: SelectedOrganization
  ): Promise<boolean> {
    const res = await this.packageEnrollment.checkPackageEnrollment({
      organization: org.id,
      account: this.context.user.id,
      package: environment.wellcoreEligibleToSelfSchedulePhaseId
    })

    return res.enrolled
  }

  private async checkHasMeeting(org: SelectedOrganization): Promise<boolean> {
    const res = await this.meetingDatabase
      .fetch({
        account: this.context.user.id,
        organization: org.id,
        limit: 1
      })
      .toPromise()

    return res.data.length > 0
  }

  private async resolveFirstLabel(): Promise<void> {
    const firstLabel = (
      await this.measurementLabel.fetchMeasurementLabels()
    ).shift()

    this.selectedLabel = firstLabel
  }
}
