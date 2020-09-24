/**
 * FormSubmissionSegment
 */

import { AccountEntity } from '../generic';
import { FormRefNamed } from './formRefNamed';

export interface FormSubmissionSegment {
  /** Submission ID. */
  id: string;
  /** A form that the submission is related to. */
  form: FormRefNamed;
  /** An account for which the submission is intended for. */
  account: AccountEntity;
  /** An account which submitted the form. */
  submittedBy: AccountEntity;
  /** Creation timestamp. */
  createdAt: string;
}
