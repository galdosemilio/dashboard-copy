export * from './form/form.component';
export * from './forms.component';
export * from './form-display/form-display.component';
export * from './form-submissions/form-submissions.component';
export * from './utils';

import {
  FormCloneDialog,
  FormCreateDialog,
  FormEditDialog,
  PatientSelectDialog,
  ViewAddendumDialog
} from '@app/dashboard/library/forms/dialogs';
import { DietersTableComponent } from './dieters-table/dieters-table.component';
import { FormAddendumTableComponent } from './form-addendum-table/form-addendum-table.component';
import { FormDisplayComponent } from './form-display/form-display.component';
import { FormSubmissionsTableComponent } from './form-submissions-table/form-submissions-table.component';
import { FormSubmissionsComponent } from './form-submissions/form-submissions.component';
import { LibraryFormComponent } from './form/form.component';
import {
  AllowedValuesFormComponent,
  FormFormComponent,
  NumericRangeFormComponent
} from './forms';
import { FormsComponent } from './forms.component';
import { FormManagerComponent } from './manager/manager.component';
import { EmbedContentPickerComponent } from './question-editor/embed-content-picker/embed-content-picker.component';
import { QuestionEditorComponent } from './question-editor/question-editor.component';
import { QuestionRendererComponent } from './question-renderer/question-renderer.component';
import {
  DateQuestionComponent,
  DatetimeQuestionComponent,
  LinearScaleQuestionComponent,
  LongAnswerQuestionComponent,
  MultipleAnswersQuestionComponent,
  MultipleOptionsQuestionComponent,
  SelectorQuestionComponent,
  ShortAnswerQuestionComponent,
  TimeQuestionComponent
} from './questions';
import { SectionEditorComponent } from './section-editor/section-editor.component';
import { SectionRendererComponent } from './section-renderer/section-renderer.component';
import {
  FormAddendumDatabase,
  FormDisplayService,
  FormsDatabase,
  FormSubmissionsDatabase
} from './services';
import { FormsTableComponent } from './table/table.component';
import {
  FormAnswersResolver,
  FormEditGuard,
  FormResolver,
  FormSubmissionsResolver
} from './utils';

const questionComponents = [
  DateQuestionComponent,
  DatetimeQuestionComponent,
  LinearScaleQuestionComponent,
  LongAnswerQuestionComponent,
  MultipleAnswersQuestionComponent,
  MultipleOptionsQuestionComponent,
  SelectorQuestionComponent,
  ShortAnswerQuestionComponent,
  TimeQuestionComponent
];

export const FormsComponents = [
  LibraryFormComponent,
  AllowedValuesFormComponent,
  DietersTableComponent,
  EmbedContentPickerComponent,
  FormAddendumTableComponent,
  FormCloneDialog,
  FormCreateDialog,
  FormEditDialog,
  FormFormComponent,
  FormManagerComponent,
  FormsComponent,
  FormDisplayComponent,
  FormSubmissionsComponent,
  FormSubmissionsTableComponent,
  FormsTableComponent,
  NumericRangeFormComponent,
  QuestionEditorComponent,
  QuestionRendererComponent,
  SectionEditorComponent,
  SectionRendererComponent,
  PatientSelectDialog,
  ViewAddendumDialog,
  ...questionComponents
];

export const FormsEntryComponents = [
  FormCloneDialog,
  FormCreateDialog,
  FormEditDialog,
  PatientSelectDialog,
  ViewAddendumDialog,
  ...questionComponents
];

export const FormsProviders = [
  FormAddendumDatabase,
  FormAnswersResolver,
  FormDisplayService,
  FormEditGuard,
  FormResolver,
  FormSubmissionsResolver,
  FormsDatabase,
  FormSubmissionsDatabase
];
