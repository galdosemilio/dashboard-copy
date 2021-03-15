export * from './account-create/account-create.dialog'
export * from './account-edit/account-edit.dialog'
export * from './add-association'
export * from './assign-form/assign-form.dialog'
export * from './doctor-pdf'
export * from './payment-disclaimer/payment-disclaimer.dialog'
export * from './progress-report-pdf'
export * from './measurement-detail/measurement-detail.dialog'
export * from './trigger-detail'

import { AccountCreateDialog } from './account-create/account-create.dialog'
import { AddAssociationDialog } from './add-association'
import { AssignFormDialog } from './assign-form/assign-form.dialog'
import { DoctorPDFDialog } from './doctor-pdf'
import { MeasurementDetailDialog } from './measurement-detail/measurement-detail.dialog'
import { PaymentDisclaimerDialog } from './payment-disclaimer/payment-disclaimer.dialog'
import { ProgressReportPDFDialog } from './progress-report-pdf'
import { TriggerDetailDialog } from './trigger-detail'

export const DialogsComponents = [
  AccountCreateDialog,
  AddAssociationDialog,
  AssignFormDialog,
  DoctorPDFDialog,
  MeasurementDetailDialog,
  PaymentDisclaimerDialog,
  ProgressReportPDFDialog,
  TriggerDetailDialog
]

export const DialogsEntryComponents = [
  AccountCreateDialog,
  AddAssociationDialog,
  AssignFormDialog,
  DoctorPDFDialog,
  MeasurementDetailDialog,
  PaymentDisclaimerDialog,
  ProgressReportPDFDialog,
  TriggerDetailDialog
]
