/**
 * formSectionRef
 */

import { createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { formQuestionData } from './formQuestionData.test';

export const formSectionRef = createValidator({
  /** Section ID. */
  id: t.string,
  /** Section title. */
  title: t.string,
  /** Additional description. */
  description: optional(t.string),
  /** Sort order of the section on the form. */
  sortOrder: t.number,
  /** Form questions. */
  questions: optional(t.array(formQuestionData))
});
