import {
  EnrolleeListingComponent,
  MessageInputComponent,
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
import {
  EnrolleesDatabase,
  SequenceResolver,
  SequencesDatabase
} from './services'
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
  SequencesTableComponent,
  SequencingFormComponent,
  SMSFormComponent,
  StepInputComponent
]

export const SequencingEntryComponents = [
  BulkUnenrollDialog,
  DuplicateSequenceDialog,
  MessagePreviewDialog
]

export const SequencingProviders = [
  EnrolleesDatabase,
  SequencesDatabase,
  SequenceResolver,
  SequenceSyncer
]
