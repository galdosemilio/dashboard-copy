export * from './account-redirect'
export * from './add-association'
export * from './add-manual-interaction'
export * from './add-recipient'
export * from './assign-form'
export * from './call-rating'
export * from './coach-permissions-dialog'
export * from './coach-select'
export * from '@coachcare/common/dialogs/core/confirm'
export * from './gesture-closing'
export * from './languages.dialog'
export * from './message-add-member'
export * from './message-patient'
export * from './options.dialog'
export * from './prompt.dialog'
export * from './remove-clinic-association'
export * from './rpm-patient-report'
export * from './rpm-status'
export * from './schedule-select.dialog'
export * from './text-input.dialog'
export * from './view-image'
export * from './multiple-files-download'
export * from './remove-patient-meeting'

import { AccountRedirectDialog } from './account-redirect'
import { AddManualInteractionDialog } from './add-manual-interaction'
import { AddRecipientDialog } from './add-recipient'
import { AddAssociationDialog } from './add-association'
import { AssignFormDialog } from './assign-form'
import { CallRatingDialog } from './call-rating/call-rating.dialog'
import { CoachSelectDialog } from './coach-select'
import { GestureClosingDialog } from './gesture-closing'
import { LanguagesDialog } from './languages.dialog'
import { MessageAddMemberDialog } from './message-add-member'
import { MessagePatientDialog } from './message-patient'
import { OptionsDialog } from './options.dialog'
import { PromptDialog } from './prompt.dialog'
import { RPMPatientReportDialog } from './rpm-patient-report'
import { RPMStatusDialog } from './rpm-status/rpm-status.dialog'
import { RPMEnableFormComponent } from './rpm-status/rpm-enable-form'
import { ScheduleSelectDialog } from './schedule-select.dialog'
import { SelectOrganizationDialog } from './select-organization'
import { TextInputDialog } from './text-input.dialog'
import { ViewImageDialog } from './view-image'
import {
  CareManagementCardComponent,
  RPMEditFormComponent,
  RPMEntryCardComponent,
  RPMSupervisingProviderEditFormComponent
} from './rpm-status'
import { RemoveClinicAssociationDialog } from './remove-clinic-association'
import { CoachPermissionsDialog } from './coach-permissions-dialog'
import { MultipleFilesDownloadDialog } from './multiple-files-download'
import { RemovePatientMeetingDialog } from './remove-patient-meeting'

export const Dialogs = [
  AccountRedirectDialog,
  AddAssociationDialog,
  AddManualInteractionDialog,
  AddRecipientDialog,
  AssignFormDialog,
  CallRatingDialog,
  CoachPermissionsDialog,
  CoachSelectDialog,
  GestureClosingDialog,
  LanguagesDialog,
  MessageAddMemberDialog,
  MessagePatientDialog,
  OptionsDialog,
  PromptDialog,
  RemoveClinicAssociationDialog,
  RPMPatientReportDialog,
  RPMStatusDialog,
  ScheduleSelectDialog,
  SelectOrganizationDialog,
  TextInputDialog,
  ViewImageDialog,
  MultipleFilesDownloadDialog,
  RemovePatientMeetingDialog
]

export const Components = [
  RPMEditFormComponent,
  RPMEnableFormComponent,
  RPMEntryCardComponent,
  RPMSupervisingProviderEditFormComponent,
  CareManagementCardComponent
]
