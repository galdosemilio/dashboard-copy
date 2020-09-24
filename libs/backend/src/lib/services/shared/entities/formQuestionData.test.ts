/**
 * formQuestionData
 */

import { createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { formQuestionTypeRef } from './formQuestionTypeRef.test';

export const formQuestionData = createValidator({
  /** Question type. */
  questionType: formQuestionTypeRef,
  /** Question title. */
  title: t.string,
  /** Question description. */
  description: optional(t.string),
  /** Order number of question within section. */
  sortOrder: t.number,
  /** Indicates wether question should be required to be answered or not. */
  isRequired: t.boolean
});
