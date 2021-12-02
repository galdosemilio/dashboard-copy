import { Component, OnInit } from '@angular/core'
import {
  ContextService,
  NotifierService,
  SelectedOrganization
} from '@app/service'
import {
  AccountTypeIds,
  FormSubmission,
  PackageEnrollment
} from '@coachcare/sdk'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { environment } from 'apps/provider/src/environments/environment'
import { filter } from 'rxjs/operators'

@UntilDestroy()
@Component({
  selector: 'app-wellcore-dashboard',
  templateUrl: './wellcore-dashboard.component.html',
  styleUrls: ['./wellcore-dashboard.component.scss'],
  host: { class: 'wellcore-component' }
})
export class WellcoreDashboardComponent implements OnInit {
  public submittedMedicalIntakeForm = false
  public eligibleToSelfSchedule = false
  public isLoading = false
  public isPatient: boolean
  public medicalIntakeFormLink: string

  constructor(
    private context: ContextService,
    private formSubmission: FormSubmission,
    private packageEnrollment: PackageEnrollment,
    private notify: NotifierService
  ) {
    this.isPatient = this.context.user.accountType.id === AccountTypeIds.Client
    this.medicalIntakeFormLink = `/library/forms/${environment.wellcoreMedicalFormId}/dieter-submissions`
  }

  ngOnInit() {
    this.context.organization$
      .pipe(untilDestroyed(this))
      .pipe(filter(() => this.isPatient))
      .subscribe((org) => this.loadPatientData(org))
  }

  private async loadPatientData(org: SelectedOrganization): Promise<void> {
    this.isLoading = true

    try {
      this.submittedMedicalIntakeForm = await this.checkMedicalIntakeFormSubmission(
        org
      )
      this.eligibleToSelfSchedule = await this.checkSelfSchedulingEligibility(
        org
      )
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
}
