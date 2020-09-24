/**
 * POST /content/form/submission
 */

import { FormAnswer } from '../../../shared';

export interface CreateFormSubmissionRequest {
  /** A form (ID) for which the submission is being created. */
  form: string;
  /** An account for which the submission is intended for. Optional for Client requests, otherwise required. */
  account?: string;
  /** An account which is submitting the form. */
  submittedBy: string;
  /** Answers to form questions. */
  answers: Array<FormAnswer>;
}
