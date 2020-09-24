/**
 * formSubmissionSegment
 */

import { createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { accountEntity } from '../generic/index.test';
import { formRefNamed } from './formRefNamed.test';

export const formSubmissionSegment = createValidator({
  /** Submission ID. */
  id: t.string,
  /** A form that the submission is related to. */
  form: formRefNamed,
  /** An account for which the submission is intended for. */
  account: accountEntity,
  /** An account which submitted the form. */
  submittedBy: accountEntity,
  /** Creation timestamp. */
  createdAt: t.string
});
