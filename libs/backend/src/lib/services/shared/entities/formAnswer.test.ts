/**
 * formAnswer
 */

import { createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';

export const formAnswer = createValidator({
  /** Question ID. */
  question: t.string,
  /** Response to the question. */
  response: createValidator({
    /** Response value. */
    value: t.any
  })
});
