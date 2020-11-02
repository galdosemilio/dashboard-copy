/**
 * Interface for POST /note/consultation
 */

export interface AddConsultationNoteRequest {
    content: string;
    subjective?: string;
    objective?: string;
    assessment?: string;
    plan?: string;
    providerOnly?: boolean;
    date?: string;
    relatedAccounts?: Array<string>;
}
