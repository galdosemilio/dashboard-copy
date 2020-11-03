/**
 * Interface for PATCH /note/general/:id
 */

export interface UpdateNoteRequest {
    id: string;
    content?: string;
    providerOnly?: boolean;
    date?: string;
    relatedAccounts?: Array<string>;
}
