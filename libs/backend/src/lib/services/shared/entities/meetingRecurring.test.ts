/**
 * meetingRecurring
 */

import { createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';

export const meetingRecurring = createValidator({
  /** Recurring template ID. */
  recurringTemplateId: t.string,
  /** A flag indicating whether a single meeting from the recurring series was edited. */
  edited: t.boolean
});
