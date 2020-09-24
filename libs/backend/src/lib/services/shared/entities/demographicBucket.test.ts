/**
 * demographicBucket
 */

import { createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';

export const demographicBucket = createValidator({
  bucket: createValidator({
    /** Bucket name. */
    name: t.string
  }),
  /** Number of people in the given age bucket. */
  count: t.number,
  /** Percentage of people in the given age bucket. */
  percentage: t.number
});
