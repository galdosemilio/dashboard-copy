export * from './account-redirect';
export * from './add-recipient';
export * from './confirm.dialog';
export * from './grid.dialog';
export * from './languages.dialog';
export * from './options.dialog';
export * from './prompt.dialog';
export * from './rpm-patient-report';
export * from './rpm-status/rpm-status.dialog';
export * from './schedule-select.dialog';
export * from './text-input.dialog';
export * from './view-image';
export * from './walkthrough';

import { AccountRedirectDialog } from './account-redirect';
import { AddRecipientDialog } from './add-recipient';
import { ConfirmDialog } from './confirm.dialog';
import { GridDialog } from './grid.dialog';
import { LanguagesDialog } from './languages.dialog';
import { OptionsDialog } from './options.dialog';
import { PromptDialog } from './prompt.dialog';
import { RPMPatientReportDialog } from './rpm-patient-report';
import { RPMStatusDialog } from './rpm-status/rpm-status.dialog';
import { ScheduleSelectDialog } from './schedule-select.dialog';
import { TextInputDialog } from './text-input.dialog';
import { ViewImageDialog } from './view-image';
import { WalkthroughDialog } from './walkthrough';

export const Dialogs = [
  AccountRedirectDialog,
  AddRecipientDialog,
  ConfirmDialog,
  GridDialog,
  LanguagesDialog,
  OptionsDialog,
  PromptDialog,
  RPMPatientReportDialog,
  RPMStatusDialog,
  ScheduleSelectDialog,
  TextInputDialog,
  ViewImageDialog,
  WalkthroughDialog
];
