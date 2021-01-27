import { ChangeDetectorRef, Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { NotifierService } from '@coachcare/common/services'
import { generateCSV } from '@coachcare/common/shared'
import { NamedEntity, Reports } from '@coachcare/npm-api'
import { environment } from '../../../../../environments/environment'
import * as moment from 'moment'

@Component({
  selector: 'ccr-ecommerce-report',
  templateUrl: './ecommerce-report.component.html'
})
export class EcommerceReportComponent implements OnInit {
  public form: FormGroup
  public isLoading = false
  public initialOrg: NamedEntity = {
    name: 'CoachCare',
    id: environment.ccrApiEnv === 'prod' ? '3637' : '30'
  }

  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private notifier: NotifierService,
    private reports: Reports
  ) {}

  public ngOnInit(): void {
    this.createForm()
  }

  public async downloadCSV(): Promise<void> {
    if (this.isLoading || this.form.invalid) {
      return
    }

    const formValue = this.form.value

    try {
      this.isLoading = true
      this.cdr.detectChanges()

      const response = await this.reports.fetchOrganizationBilling({
        organization: formValue.organization,
        asOf: formValue.date.endOf('day').toISOString(),
        status: formValue.status,
        limit: 'all'
      })

      let csv = ''
      const separator = ','

      csv += `"ORGANIZATION ID"${separator}`
      csv += `"ORGANIZATION NAME"${separator}`
      csv += `"NUMBER OF LOCATIONS"${separator}`
      csv += `"REGISTERED PATIENTS - LAST THREE MONTHS"${separator}`
      csv += `"ACTIVE PATIENTS - LAST THREE MONTHS"${separator}`
      csv += `"RPM-ENABLED PATIENTS"${separator}`
      csv += `"TOTAL PATIENTS"${separator}`
      csv += `"REGISTERED COACHES"${separator}`
      csv += `"ACTIVE COACHES"${separator}`
      csv += `"VIDEO CALL AMOUNT"${separator}`
      csv += `"PLAN ID"${separator}`
      csv += `"PLAN NAME"${separator}`
      csv += `"IS BILLABLE"${separator}`
      csv += `"ENTITY ID"${separator}`
      csv += `"ENTITY TYPE"${separator}`
      csv += `"BASE PRICING"${separator}`
      csv += `"RPM PATIENT PRICING"${separator}`
      csv += `"CHURN DATE"${separator}`
      csv += `"PAYING START DATE"${separator}`
      csv += `"IS PAYING"${separator}`
      csv += `"RENEWAL DATE"${separator}`
      csv += `"PARENT CLINIC ID"${separator}`
      csv += `"PARENT CLINIC NAME"${separator}`
      csv += `"END DATE"`

      csv += `\r\n`

      response.data.forEach((item) => {
        csv += `"${item.organization.id}"${separator}`
        csv += `"${item.organization.name}"${separator}`
        csv += `"${
          item.numberOfLocations ? item.numberOfLocations : '-'
        }"${separator}`
        csv += `"${item.patients.lastThreeMonths.registered.count}"${separator}`
        csv += `"${item.patients.lastThreeMonths.active.count}"${separator}`
        csv += `"${item.patients.rpm.count}"${separator}`
        csv += `"${item.patients.total.registered.count}"${separator}`
        csv += `"${item.providers.registered.count}"${separator}`
        csv += `"${item.providers.active.count}"${separator}`
        csv += `"${
          item.videoCalls ? item.videoCalls.twilio.count : '-'
        }"${separator}`
        csv += `"${item.plan && item.plan.id ? item.plan.id : '-'}"${separator}`
        csv += `"${
          item.plan && item.plan.name ? item.plan.name : '-'
        }"${separator}`
        csv += `"${
          item.entity ? (item.entity.isBillable ? 'Yes' : 'No') : '-'
        }"${separator}`
        csv += `"${item.entity ? item.entity.type.id : '-'}"${separator}`
        csv += `"${item.entity ? item.entity.type.name : '-'}"${separator}`
        csv += `"${item.pricing.base ? item.pricing.base : '-'}"${separator}`
        csv += `"${
          item.pricing.rpmPatient ? item.pricing.rpmPatient : '-'
        }"${separator}`
        csv += `"${
          item.churnDate ? item.churnDate.split('T')[0] : '-'
        }"${separator}`
        csv += `"${
          item.payingStartDate ? item.payingStartDate : '-'
        }"${separator}`
        csv += `"${
          item.isPaying !== undefined
            ? item.isPaying
              ? 'Paying'
              : 'Non-paying'
            : '-'
        }"${separator}`
        csv += `"${item.renewalDate ? item.renewalDate : '-'}"${separator}`
        csv += `"${item.parent ? item.parent.id : '-'}"${separator}`
        csv += `"${item.parent ? item.parent.name : '-'}"${separator}`
        csv += `"${formValue.date.endOf('day').format('YYYY-MM-DD')}"`
        csv += `\r\n`
      })

      generateCSV({
        content: csv,
        filename: 'Internal Ecommerce Report'
      })
    } catch (error) {
      this.notifier.error(error)
    } finally {
      this.isLoading = false
      this.cdr.detectChanges()
    }
  }

  private createForm(): void {
    this.form = this.fb.group({
      date: [moment().endOf('day'), Validators.required],
      status: ['active', Validators.required],
      organization: ['', Validators.required]
    })
  }
}
