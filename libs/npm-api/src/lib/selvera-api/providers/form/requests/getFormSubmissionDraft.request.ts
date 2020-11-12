/**
 * Interface for GET /content/form/submission/draft/:form
 */

export interface GetFormSubmissionDraftRequest {
  /** Account the submission is intended for */
  account?: string
  /** Form the submission is intended for. */
  form: string
}
