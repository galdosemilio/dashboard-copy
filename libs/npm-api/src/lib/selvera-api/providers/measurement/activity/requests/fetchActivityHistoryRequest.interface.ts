/**
 * Interface for GET /measurement/activity/history
 */

export interface FetchActivityHistoryRequest {
    account?: string;
    startDate: string;
    endDate?: string;
    device?: string;
}
