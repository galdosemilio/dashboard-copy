/**
 * meetingAttendeeData
 */

import { createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';

export const meetingAttendeeData = createValidator({
  /** The id of the account. */
  account: t.string,
  /** The first name of the individual. */
  firstName: t.string,
  /** The last name of the individual. */
  lastName: t.string,
  /** The email of the individual. */
  email: t.string,
  /** A flag indicating whether the participant attended the meeting. */
  attended: optional(t.boolean)
});
