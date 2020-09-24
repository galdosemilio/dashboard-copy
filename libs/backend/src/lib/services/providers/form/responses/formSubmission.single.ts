/**
 * GET /content/form/submission/:id
 */

import { AccountEntity, FormAddendumRef, FormAnswer, FormRefNamed } from '../../../shared';

export interface FormSubmissionSingle {
  /** Submission ID. */
  id: string;
  /** A form that the submission is related to. */
  form: FormRefNamed;
  /** An account for which the submission is intended for. */
  account: AccountEntity;
  /** An account which submitted the form. */
  submittedBy: AccountEntity;
  /** Answers to form questions. */
  answers: Array<FormAnswer>;
  /** Creation timestamp. */
  createdAt: string;
  /** Addendum collection. */
  addendums: Array<FormAddendumRef>;
}
