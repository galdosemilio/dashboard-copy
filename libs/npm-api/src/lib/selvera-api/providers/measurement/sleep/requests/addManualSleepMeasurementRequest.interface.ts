/**
 * Interface for POST /measurement/sleep
 */

export interface AddManualSleepMeasurementRequest {
    clientId?: string;
    deviceId: number;
    quality?: number;
    startTime: string;
    endTime: string;
}
