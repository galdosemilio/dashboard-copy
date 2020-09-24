/**
 * bucketReported
 */

import { createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { demographicBucket } from './demographicBucket.test';

export const bucketReported = createValidator({
  /** Organization data. */
  organization: createValidator({
    /** Organization ID. */
    id: t.string,
    /** Organization name. */
    name: t.string
  }),
  /** Age bucket collection. */
  buckets: t.array(demographicBucket)
});
