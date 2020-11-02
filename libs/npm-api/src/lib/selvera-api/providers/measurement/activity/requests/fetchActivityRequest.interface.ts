/**
 * Interface for GET /measurement/activity
 */

export interface FetchActivityRequest {
    account?: string;
    startDate?: string;
    endDate?: string;
    max?: number | 'all';
    direction?: 'asc' | 'desc';
    device?: number;
}
