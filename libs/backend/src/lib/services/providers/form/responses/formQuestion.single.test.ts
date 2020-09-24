/**
 * GET /content/form/question/:id
 */

import { createTestFromValidator, createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { entity, formRef } from '../../../shared/index.test';
import { FormQuestionSingle } from './formQuestion.single';

export const formQuestionSingle = createValidator({
  /** Question ID. */
  id: t.string,
  /** Form section of question. */
  section: entity,
  /** Type of a question. */
  questionType: entity,
  /** A form that the question belongs to. */
  form: optional(formRef),
  /** Question title. */
  title: t.string,
  /** Question description. */
  description: optional(t.string),
  /** Order number of question within section. */
  sortOrder: t.number,
  /** Indicates wether question should be answered or not. */
  isRequired: t.boolean,
  /** A collection of allowed responses to the question. */
  allowedValues: optional(t.array(t.string))
});

export const formQuestionResponse = createTestFromValidator<FormQuestionSingle>(
  'FormQuestionSingle',
  formQuestionSingle
);
