export * from './clinic'
export * from './clinics.component'
export * from './services'
export * from './table/picker/picker.component'

import {
  ClinicComponent,
  ClinicFormComponent,
  ClinicInfoComponent,
  ClinicPhasesComponent,
  ClinicPhasesTableComponent,
  ClinicSettingsComponent
} from './clinic'
import { ClinicsComponent } from './clinics.component'
import { CreateClinicDialog, CreatePhaseDialog } from './dialogs'
import { ClinicResolver, ClinicsDatabase } from './services'
import { ClinicsPickerComponent } from './table/picker/picker.component'
import { ClinicsTableComponent } from './table/table.component'

export const ClinicsComponents = [
  ClinicComponent,
  ClinicFormComponent,
  ClinicInfoComponent,
  ClinicPhasesComponent,
  ClinicPhasesTableComponent,
  ClinicsComponent,
  ClinicsPickerComponent,
  ClinicsTableComponent,
  ClinicSettingsComponent,
  CreateClinicDialog,
  CreatePhaseDialog
]

export const ClinicsEntryComponents = [CreateClinicDialog, CreatePhaseDialog]

export const ClinicsProviders = [ClinicResolver, ClinicsDatabase]
