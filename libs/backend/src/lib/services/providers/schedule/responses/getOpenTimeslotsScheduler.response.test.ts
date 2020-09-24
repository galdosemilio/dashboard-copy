/**
 * GET /scheduler
 */

import { createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';

export const getOpenTimeslotsSchedulerResponse = t.array(
  createValidator({
    /** The provider's account id. */
    account: t.string,
    /** The start time, in ISO8601 format. */
    startTime: t.string
  })
);
