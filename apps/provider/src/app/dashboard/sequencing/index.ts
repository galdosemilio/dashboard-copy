import {
  EnrolleeListingComponent,
  MessageInputComponent,
  SequenceSettingsComponent,
  StepInputComponent
} from './components'
import {
  BulkUnenrollDialog,
  DuplicateSequenceDialog,
  MessagePreviewDialog
} from './dialogs'
import {
  EmailFormComponent,
  NotificationFormComponent,
  PackageFormComponent,
  SequencingFormComponent,
  SMSFormComponent
} from './form'
import { SequenceComponent } from './sequence'
import { SequencesComponent, SequencesTableComponent } from './sequences'
import { EnrolleesDatabase, SequenceResolver } from './services'
import { SequenceSyncer } from './utils'

export const SequencingComponents = [
  BulkUnenrollDialog,
  DuplicateSequenceDialog,
  EmailFormComponent,
  EnrolleeListingComponent,
  MessageInputComponent,
  MessagePreviewDialog,
  NotificationFormComponent,
  PackageFormComponent,
  SequenceComponent,
  SequencesComponent,
  SequenceSettingsComponent,
  SequencesTableComponent,
  SequencingFormComponent,
  SMSFormComponent,
  StepInputComponent
]

export const SequencingProviders = [
  EnrolleesDatabase,
  SequenceResolver,
  SequenceSyncer
]
