/**
 * meetingAttendeeDataExtended
 */

import { createValidator } from '@coachcare/backend/tests';
import { accountTypeId, timezoneItem } from '../generic/index.test';
import { meetingAttendeeData } from './meetingAttendeeData.test';

export const meetingAttendeeDataExtended = createValidator({
  ...meetingAttendeeData.type.props,
  /** The account type of the individual. */
  accountTypeId: accountTypeId,
  /** The timeone of the individual. */
  timezone: timezoneItem
});
