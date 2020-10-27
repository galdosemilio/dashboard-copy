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
} from '@app/dashboard/library/forms/questions';
import { FormQuestionType } from './question-type.interface';

export const QUESTION_TYPE_MAP: { [id: string]: FormQuestionType } = {
  1: {
    component: ShortAnswerQuestionComponent,
    id: '1',
    name: 'short',
    description: 'Short Answer',
    requiresValueList: false,
    isActive: true
  },
  2: {
    component: LongAnswerQuestionComponent,
    id: '2',
    name: 'long',
    description: 'Long Answer',
    requiresValueList: false,
    isActive: true
  },
  3: {
    component: MultipleOptionsQuestionComponent,
    id: '3',
    name: 'radios',
    description: 'Multiple Options',
    requiresValueList: true,
    isActive: true
  },
  4: {
    component: MultipleAnswersQuestionComponent,
    id: '4',
    name: 'checkboxes',
    description: 'Multiple Answers',
    requiresValueList: true,
    isActive: true
  },
  5: {
    component: SelectorQuestionComponent,
    id: '5',
    name: 'select',
    description: 'Selector',
    requiresValueList: true,
    isActive: true
  },
  6: {
    component: LinearScaleQuestionComponent,
    id: '6',
    name: 'scale',
    description: 'Linear Scale',
    requiresValueList: false,
    requiresNumericRange: true,
    isActive: true
  },
  7: {
    component: DateQuestionComponent,
    id: '7',
    name: 'date',
    description: 'Date',
    requiresValueList: false,
    isActive: false
  },
  8: {
    component: DatetimeQuestionComponent,
    id: '8',
    name: 'datetime',
    description: 'Date Time',
    requiresValueList: false,
    isActive: false
  },
  9: {
    component: TimeQuestionComponent,
    id: '9',
    name: 'time',
    description: 'Time',
    requiresValueList: false,
    isActive: false
  },
  10: {
    component: undefined,
    id: '10',
    name: 'text',
    description: 'Text',
    requiresValueList: false,
    isActive: true,
    disregardRequired: true,
    shouldHideIndex: true
  },
  11: {
    component: undefined,
    id: '11',
    name: 'content',
    description: 'Content',
    requiresValueList: false,
    isActive: true,
    disregardRequired: true,
    shouldHideIndex: true,
    usesUrl: true
  }
};
