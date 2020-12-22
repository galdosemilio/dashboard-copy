export * from './form/dieter.component'
export * from './services'
export * from './dieter/settings'

export * from './dieter/dieter.component'
export * from './dieter/dashboard/dashboard.component'
export * from './dieter/journal/journal.component'
export * from './dieter/measurements/measurements.component'
export * from './dieter/messages/messages.component'

import { DieterListingNoPhiComponent } from './dieter-listing-no-phi/dieter-listing-no-phi.component'
import { DieterListingWithPhiComponent } from './dieter-listing-with-phi/dieter-listing-with-phi.component'
import { DieterDashboardComponent } from './dieter/dashboard/dashboard.component'
import { StatDiffComponent } from './dieter/dashboard/stat-diff/stat-diff.component'
import { StatSingleComponent } from './dieter/dashboard/stat-single/stat-single.component'
import { DieterComponent } from './dieter/dieter.component'
import { JournalComponents, JournalEntryComponents } from './dieter/journal'
import {
  MeasurementComponents,
  MeasurementEntryComponents
} from './dieter/measurements'
import { DieterMessagesComponent } from './dieter/messages/messages.component'
import {
  AssociationsDatabase,
  DevicesDatabase,
  SequenceEnrollmentDatabase,
  SettingsComponents,
  TriggerHistoryDatabase,
  VaultDatabase
} from './dieter/settings'
import { LabelsDatabase } from './dieter/settings'
import {
  DietersExpandableTableComponent,
  PatientFirstNameCell
} from './expandable-table'
import { AccountIdentifiersComponent } from './form/account-identifiers/account-identifiers.component'
import { AccountIdentifierSyncer } from './form/account-identifiers/utils'
import { DieterFormComponent } from './form/dieter.component'
import {
  DieterDataService,
  DieterListingDatabase,
  DieterResolver,
  DietersGuard,
  DietersNoPhiGuard,
  ExerciseDatabase,
  FoodDatabase,
  FoodKeyDatabase,
  GoalsResolver,
  HydrationDatabase,
  LevlDatabase,
  LevlDataSource,
  MeasurementDatabase,
  MetricsDatabase,
  PainDatabase,
  SupplementDatabase
} from './services'

export const DietersComponents = [
  DietersExpandableTableComponent,
  StatDiffComponent,
  StatSingleComponent,
  DieterComponent,
  DieterFormComponent,
  DieterDashboardComponent,
  DieterListingNoPhiComponent,
  DieterListingWithPhiComponent,
  DieterMessagesComponent,
  AccountIdentifiersComponent,
  PatientFirstNameCell,
  ...SettingsComponents,
  ...JournalComponents,
  ...MeasurementComponents
]

export const DietersEntryComponents = [
  AccountIdentifiersComponent,
  ...JournalEntryComponents,
  ...MeasurementEntryComponents,
  ...SettingsComponents
]

export const DietersProviders = [
  AccountIdentifierSyncer,
  AssociationsDatabase,
  DevicesDatabase,
  DieterDataService,
  DieterListingDatabase,
  DieterResolver,
  DietersGuard,
  DietersNoPhiGuard,
  ExerciseDatabase,
  FoodDatabase,
  FoodKeyDatabase,
  GoalsResolver,
  HydrationDatabase,
  LabelsDatabase,
  LevlDataSource,
  MeasurementDatabase,
  MetricsDatabase,
  PainDatabase,
  SupplementDatabase,
  LevlDatabase,
  SequenceEnrollmentDatabase,
  TriggerHistoryDatabase,
  VaultDatabase
]
