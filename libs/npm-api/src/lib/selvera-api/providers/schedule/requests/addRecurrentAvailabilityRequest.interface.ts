/**
 * Interface for POST /available
 */

export interface AddRecurrentAvailabilityRequest {
    provider?: string;
    startDay: number; // 0 - 6 :: Sunday - Saturday
    endDay: number;
    startTime: string; // HH:MM 24h format, minutes must be divisible by 5
    endTime: string;
}
