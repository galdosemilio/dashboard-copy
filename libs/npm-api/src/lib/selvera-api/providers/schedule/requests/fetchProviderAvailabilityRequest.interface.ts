/**
 * Interface for GET /scheduler
 */

export interface FetchProviderAvailabilityRequest {
    accounts?: Array<string>;
    startDay?: string; // YYYY-MM-DD day to fetch open timeslots for - previous day, startDay, and following 5 days
    duration: number; // number of minutes required for meeting
}
