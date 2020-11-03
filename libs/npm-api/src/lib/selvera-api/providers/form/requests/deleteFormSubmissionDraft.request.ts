/**
 * Interface for DELETE /content/form/submission/draft/:form
 */

export interface DeleteFormSubmissionDraftRequest {
    /** Account the submission is intended for. Should be passed as a query parameter. */
    account?: string;
    /** Form the submission is intended for. */
    form: string;
}
