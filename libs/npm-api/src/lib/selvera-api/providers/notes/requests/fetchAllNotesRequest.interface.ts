/**
 * Interface for GET /note/general
 */

export interface FetchAllNotesRequest {
    account?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
    limit?: number | 'all';
    offset?: number;
}
