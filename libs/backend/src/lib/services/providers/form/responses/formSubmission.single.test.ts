/**
 * GET /content/form/submission/:id
 */

import { createTestFromValidator, createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import {
  accountEntity,
  formAddendumRef,
  formAnswer,
  formRefNamed
} from '../../../shared/index.test';
import { FormSubmissionSingle } from './formSubmission.single';

export const formSubmissionSingle = createValidator({
  /** Submission ID. */
  id: t.string,
  /** A form that the submission is related to. */
  form: formRefNamed,
  /** An account for which the submission is intended for. */
  account: accountEntity,
  /** An account which submitted the form. */
  submittedBy: accountEntity,
  /** Answers to form questions. */
  answers: t.array(formAnswer),
  /** Creation timestamp. */
  createdAt: t.string,
  /** Addendum collection. */
  addendums: t.array(formAddendumRef)
});

export const formSubmissionResponse = createTestFromValidator<FormSubmissionSingle>(
  'FormSubmissionSingle',
  formSubmissionSingle
);
