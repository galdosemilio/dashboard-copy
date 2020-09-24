/**
 * MeetingAttendeeDataExtended
 */

import { AccountTypeId, TimezoneItem } from '../generic';
import { MeetingAttendeeData } from './meetingAttendeeData';

export interface MeetingAttendeeDataExtended extends MeetingAttendeeData {
  /** The account type of the individual. */
  accountTypeId: AccountTypeId;
  /** The timeone of the individual. */
  timezone: TimezoneItem;
}
