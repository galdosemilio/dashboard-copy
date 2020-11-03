/**
 * Interface for PATCH /note/consultation/:id
 */

export interface UpdateConsultationNoteRequest {
    id: string;
    content?: string;
    subjective?: string;
    objective?: string;
    assessment?: string;
    plan?: string;
    providerOnly?: boolean;
    date?: string;
    relatedAccounts?: Array<string>;
}
