import { ChangeDetectorRef, Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { NotifierService } from '@coachcare/common/services'
import { CSV } from '@coachcare/common/shared'
import { NamedEntity, Reports } from '@coachcare/sdk'
import { environment } from '../../../../../environments/environment'
import * as moment from 'moment'
import Papa from 'papaparse'

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

      const data = response.data.map((item) => ({
        'ORGANIZATION ID': item.organization.id,
        'ORGANIZATION NAME': item.organization.name,
        'NUMBER OF LOCATIONS': item.numberOfLocations
          ? item.numberOfLocations
          : '-',
        'REGISTERED PATIENTS - LAST THREE MONTHS':
          item.patients.lastThreeMonths.registered.count,
        'ACTIVE PATIENTS - LAST THREE MONTHS':
          item.patients.lastThreeMonths.active.count,
        'RPM-ENABLED PATIENTS': item.patients.rpm.count,
        'TOTAL PATIENTS': item.patients.total.registered.count,
        'REGISTERED COACHES': item.providers.registered.count,
        'ACTIVE COACHES': item.providers.active.count,
        'VIDEO CALL AMOUNT': item.videoCalls
          ? item.videoCalls.twilio.count
          : '-',
        'PLAN ID': item.plan && item.plan.id ? item.plan.id : '-',
        'PLAN NAME': item.plan && item.plan.name ? item.plan.name : '-',
        'IS BILLABLE': item.entity
          ? item.entity.isBillable
            ? 'Yes'
            : 'No'
          : '-',
        'ENTITY ID': item.entity ? item.entity.type.id : '-',
        'ENTITY TYPE': item.entity ? item.entity.type.name : '-',
        'BASE PRICING': item.pricing.base ? item.pricing.base : '-',
        'RPM PATIENT PRICING': item.pricing.rpmPatient
          ? item.pricing.rpmPatient
          : '-',
        'PER NONRPM PATIENT PRICING': item.pricing.nonRpmPatient
          ? item.pricing.nonRpmPatient
          : '-',
        'CHURN DATE': item.churnDate ? item.churnDate.split('T')[0] : '-',
        'PAYING START DATE': item.payingStartDate ? item.payingStartDate : '-',
        'IS PAYING':
          item.isPaying !== undefined
            ? item.isPaying
              ? 'Paying'
              : 'Non-paying'
            : '-',
        'RENEWAL DATE': item.renewalDate ? item.renewalDate : '-',
        'PARENT CLINIC ID': item.parent ? item.parent.id : '-',
        'PARENT CLINIC NAME': item.parent ? item.parent.name : '-',
        'AS OF': formValue.date.endOf('day').format('YYYY-MM-DD')
      }))

      const csv = Papa.unparse(data)

      CSV.toFile({
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
