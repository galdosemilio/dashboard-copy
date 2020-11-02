/**
 * Interface for GET /note/general/:id (response)
 */

export interface FetchNoteResponse {
    id: string;
    content: string;
    createdBy: string; // AccountId
    providerOnly: boolean;
    date: string; // timestamp
    createdAt: string; // timestamp
    updatedAt?: string; // timestamp
    relatedAccounts: Array<string>;
}
