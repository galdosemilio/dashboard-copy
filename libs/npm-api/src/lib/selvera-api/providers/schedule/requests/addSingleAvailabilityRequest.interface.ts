/**
 * Interface for POST /available/single
 */

export interface AddSingleAvailabilityRequest {
    provider?: string;
    startTime: string; // timestamp with timezone
    endTime: string; // must be after startTime
}
