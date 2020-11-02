/**
 * Interface for GET /note/consultation
 */

export interface FetchAllConsultationNotesRequest {
    account?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
    subjective?: string;
    objective?: string;
    assessment?: string;
    plan?: string;
    limit?: number | 'all';
    offset?: number;
}
