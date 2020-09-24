/**
 * formSubmissionRef
 */

import { createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { entity } from '../generic/index.test';

export const formSubmissionRef = createValidator({
  /** Submission ID. */
  id: t.string,
  /** Submission account. */
  account: entity
});
