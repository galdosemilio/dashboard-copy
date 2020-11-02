/**
 * Interface for unfiltered GET /measurement/body
 */

export interface FetchUnfilteredBodyMeasurementRequest {
    clientId?: string;
    start_date?: string;
    end_date?: string;
    max?: number | 'all';
    direction?: 'asc' | 'desc';
    device?: number;
}
