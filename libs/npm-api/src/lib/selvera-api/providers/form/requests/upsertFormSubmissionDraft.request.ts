/**
 * Interface for PUT /content/form/submission/draft/:form
 */

export interface UpsertFormSubmissionDraftRequest {
    /** Account the submission is intended for */
    account?: string;
    /** Draft data */
    data: any;
    /** Form the submission is intended for. */
    form: string;
}
