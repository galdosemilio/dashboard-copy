/**
 * POST /content/form/submission
 */

import { FormAnswer } from '../entities'

export interface CreateFormSubmissionRequest {
  /** A form (ID) for which the submission is being created. */
  form: string
  /** An account for which the submission is intended for. */
  account: string
  /** An account which is submitting the form. */
  submittedBy: string
  /** Answers to form questions. */
  answers: Array<FormAnswer>
  /** An organization the submission is created for. Defaults to the form's organization. */
  organization?: string
}
