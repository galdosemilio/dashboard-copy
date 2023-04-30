import { RPMBillingComponent } from './rpm-billing'
import { ClinicPatientCodeComponent } from './clinic-patient-code'
import { PatientBulkReportsComponent } from './patient-bulk-reports'
import { RPMReportComponent } from './rpm.component'

export * from './rpm.component'

export const RPMComponents = [
  ClinicPatientCodeComponent,
  RPMReportComponent,
  RPMBillingComponent,
  PatientBulkReportsComponent
]
