export * from './clinic'
export * from './clinics.component'
export * from './services'
export * from './table/picker/picker.component'

import {
  AutoThreadManagementComponent,
  ClinicBillableServicesComponent,
  ClinicComponent,
  ClinicFormComponent,
  ClinicInfoComponent,
  ClinicPhasesComponent,
  ClinicPhasesTableComponent,
  ClinicSettingsComponent,
  ClinicSupervisingProvidersTable
} from './clinic'
import { ClinicsComponent } from './clinics.component'
import {
  AddSupervisingProviderDialog,
  CreateClinicDialog,
  CreatePhaseDialog
} from './dialogs'
import { ClinicResolver, ClinicsDatabase, TinInputGuard } from './services'
import { ParticipantDatabase } from './clinic/settings/services'
import { ClinicsPickerComponent } from './table/picker/picker.component'
import { ClinicsTableComponent } from './table/table.component'

export const ClinicsComponents = [
  AddSupervisingProviderDialog,
  AutoThreadManagementComponent,
  ClinicBillableServicesComponent,
  ClinicComponent,
  ClinicFormComponent,
  ClinicInfoComponent,
  ClinicPhasesComponent,
  ClinicPhasesTableComponent,
  ClinicSupervisingProvidersTable,
  ClinicsComponent,
  ClinicsPickerComponent,
  ClinicsTableComponent,
  ClinicSettingsComponent,
  CreateClinicDialog,
  CreatePhaseDialog
]

export const ClinicsEntryComponents = [
  AddSupervisingProviderDialog,
  CreateClinicDialog,
  CreatePhaseDialog
]

export const ClinicsProviders = [
  ClinicResolver,
  ClinicsDatabase,
  ParticipantDatabase,
  TinInputGuard
]
