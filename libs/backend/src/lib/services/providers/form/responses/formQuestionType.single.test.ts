/**
 * GET /content/form/question-type/:id
 */

import { createTestFromValidator, createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { FormQuestionTypeSingle } from './formQuestionType.single';

export const formQuestionTypeSingle = createValidator({
  /** Question type ID. */
  id: t.string,
  /** Question type name. */
  name: t.string,
  /** Question type description. */
  description: t.string,
  /** A flag indicating if the question type is active. */
  isActive: t.boolean,
  /** A flag indicating whether the question should require a list of values to be provided. */
  requiresValueList: t.boolean
});

export const formQuestionTypeResponse = createTestFromValidator<FormQuestionTypeSingle>(
  'FormQuestionTypeSingle',
  formQuestionTypeSingle
);
