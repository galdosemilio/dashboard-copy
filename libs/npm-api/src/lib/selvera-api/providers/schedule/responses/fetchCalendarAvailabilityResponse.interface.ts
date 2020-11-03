/**
 * Interface for GET /available/calendar (response)
 */

import { FetchCalendarAvailabilitySegment } from './fetchCalendarAvailabilitySegment.interface';

export interface FetchCalendarAvailabilityResponse {
    entries: Array<FetchCalendarAvailabilitySegment>;
}
