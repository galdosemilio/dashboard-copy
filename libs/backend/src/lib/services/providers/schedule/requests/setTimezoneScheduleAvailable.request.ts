/**
 * POST /available/timezone
 */

import { AvailabilityTimezone } from '../../../shared';

export interface SetTimezoneScheduleAvailableRequest {
  timezones: Array<AvailabilityTimezone>;
}
