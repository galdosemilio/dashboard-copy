export * from './form/dieter.component'
export * from './services'
export * from './helpers'
export * from './dieter/settings'

export * from './dieter/dieter.component'
export * from './dieter/dashboard/dashboard.component'
export * from './dieter/journal/journal.component'
export * from './dieter/measurements/measurements.component'
export * from './dieter/messages/messages.component'

import { MessagesProviders } from '@app/dashboard/messages'
import { DieterListingNoPhiComponent } from './dieter-listing-no-phi/dieter-listing-no-phi.component'
import { DieterListingWithPhiComponent } from './dieter-listing-with-phi/dieter-listing-with-phi.component'
import { DieterDashboardComponents } from './dieter/dashboard'
import { DieterComponent } from './dieter/dieter.component'
import { JournalComponents } from './dieter/journal'
import { MeasurementComponents } from './dieter/measurements'
import { DieterMessagesComponent } from './dieter/messages/messages.component'
import {
  AssociationsDatabase,
  DevicesDatabase,
  PhaseEnrollmentDatabase,
  SequenceEnrollmentDatabase,
  SettingsComponents,
  TriggerHistoryDatabase,
  VaultDatabase,
  CellularDeviceDatabase,
  CellularDeviceDataSource,
  UpcomingTransitionsDatabase
} from './dieter/settings'
import {
  DietersExpandableTableComponent,
  PatientFirstNameCell
} from './expandable-table'
import { AccountIdentifiersComponent } from './form/account-identifiers/account-identifiers.component'
import { DieterFormComponent } from './form/dieter.component'
import {
  DieterListingDatabase,
  DieterResolver,
  DietersGuard,
  DietersNoPhiGuard,
  ExerciseDatabase,
  FoodDatabase,
  FoodKeyDatabase,
  GoalsResolver,
  HydrationDatabase,
  MeasurementDatabase,
  MetricsDatabase,
  PainDatabase,
  SupplementDatabase
} from './services'

export const DietersComponents = [
  DietersExpandableTableComponent,
  DieterComponent,
  DieterFormComponent,
  DieterListingNoPhiComponent,
  DieterListingWithPhiComponent,
  DieterMessagesComponent,
  AccountIdentifiersComponent,
  PatientFirstNameCell,
  ...SettingsComponents,
  ...JournalComponents,
  ...MeasurementComponents,
  ...DieterDashboardComponents
]

export const DietersProviders = [
  AssociationsDatabase,
  DevicesDatabase,
  DieterListingDatabase,
  DieterResolver,
  DietersGuard,
  DietersNoPhiGuard,
  ExerciseDatabase,
  FoodDatabase,
  FoodKeyDatabase,
  GoalsResolver,
  HydrationDatabase,
  MeasurementDatabase,
  MetricsDatabase,
  PainDatabase,
  PhaseEnrollmentDatabase,
  SupplementDatabase,
  SequenceEnrollmentDatabase,
  TriggerHistoryDatabase,
  VaultDatabase,
  CellularDeviceDatabase,
  CellularDeviceDataSource,
  UpcomingTransitionsDatabase,
  ...MessagesProviders
]
