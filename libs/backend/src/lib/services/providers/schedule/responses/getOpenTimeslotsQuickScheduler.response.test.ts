/**
 * GET /scheduler/quick
 */

import { createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';

export const getOpenTimeslotsQuickSchedulerResponse = t.array(
  createValidator({
    /** The provider's account id. */
    account: t.number,
    /** The start time, in ISO8601 format. */
    startTime: t.string
  })
);
