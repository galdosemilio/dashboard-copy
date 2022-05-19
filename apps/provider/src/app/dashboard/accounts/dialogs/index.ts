export * from './account-create/account-create.dialog'
export * from './account-edit/account-edit.dialog'
export * from './doctor-pdf'
export * from './payment-disclaimer/payment-disclaimer.dialog'
export * from './progress-report-pdf'
export * from './trigger-detail'

import { AccountCreateDialog } from './account-create/account-create.dialog'
import { AccountEditDialog } from './account-edit/account-edit.dialog'
import { DoctorPDFDialog } from './doctor-pdf'
import { PaymentDisclaimerDialog } from './payment-disclaimer/payment-disclaimer.dialog'
import { ProgressReportPDFDialog } from './progress-report-pdf'
import { TriggerDetailDialog } from './trigger-detail'

export const DialogsComponents = [
  AccountCreateDialog,
  AccountEditDialog,
  DoctorPDFDialog,
  PaymentDisclaimerDialog,
  ProgressReportPDFDialog,
  TriggerDetailDialog
]
