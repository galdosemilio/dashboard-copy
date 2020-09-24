/**
 * GET /measurement/activity/detailed
 */

import { createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';

export const getDetailedMeasurementActivityResponse = t.array(
  createValidator({
    /** The start time of this activity segment. */
    activity_start: t.string,
    /** The level of activity, 0 is least active and 100 is most active. */
    activity_level: t.number
  })
);
