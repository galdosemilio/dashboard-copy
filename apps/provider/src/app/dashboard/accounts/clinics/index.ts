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
  ClinicMeasurementLabelsComponent,
  ClinicMeasurementsComponent,
  ClinicPhasesComponent,
  ClinicPhasesTableComponent,
  ClinicSequenceAutoEnrollmentComponent,
  ClinicSettingsComponent,
  ClinicSupervisingProvidersTable
} from './clinic'
import { ClinicsComponent } from './clinics.component'
import {
  AddDataPointTypeDialog,
  AddMeasurementLabelDialog,
  AddSequenceAutoenrollmentDialog,
  AddSupervisingProviderDialog,
  CreateClinicDialog,
  CreatePhaseDialog,
  EditMeasurementLabelDialog
} from './dialogs'
import { MeasurementLabelFormComponent } from './forms'
import {
  ClinicResolver,
  ClinicsDatabase,
  MeasurementLabelDatabase,
  SequenceAutoEnrollmentsDatabase,
  TinInputGuard
} from './services'
import { ParticipantDatabase } from './clinic/settings/services'
import { ClinicsPickerComponent } from './table/picker/picker.component'
import { ClinicsTableComponent } from './table/table.component'
import { CcrOrganizationDialogs } from '@coachcare/common/services'

export const ClinicsComponents = [
  AddDataPointTypeDialog,
  AddMeasurementLabelDialog,
  AddSupervisingProviderDialog,
  AddSequenceAutoenrollmentDialog,
  AutoThreadManagementComponent,
  ClinicBillableServicesComponent,
  ClinicComponent,
  ClinicFormComponent,
  ClinicInfoComponent,
  ClinicMeasurementLabelsComponent,
  ClinicMeasurementsComponent,
  ClinicPhasesComponent,
  ClinicPhasesTableComponent,
  ClinicSupervisingProvidersTable,
  ClinicsComponent,
  ClinicsPickerComponent,
  ClinicsTableComponent,
  ClinicSequenceAutoEnrollmentComponent,
  ClinicSettingsComponent,
  CreateClinicDialog,
  CreatePhaseDialog,
  EditMeasurementLabelDialog,
  MeasurementLabelFormComponent
]

export const ClinicsProviders = [
  CcrOrganizationDialogs,
  ClinicResolver,
  ClinicsDatabase,
  MeasurementLabelDatabase,
  ParticipantDatabase,
  TinInputGuard,
  SequenceAutoEnrollmentsDatabase
]
