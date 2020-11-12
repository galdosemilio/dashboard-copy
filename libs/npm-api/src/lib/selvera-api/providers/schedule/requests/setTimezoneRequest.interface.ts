/**
 * Interface for POST /available/timezone
 */

import { AccountTimezone } from '../entities/timezone.interface'

export interface SetTimezoneRequest {
  timezones: Array<AccountTimezone>
}
