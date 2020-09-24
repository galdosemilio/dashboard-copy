/**
 * FormSubmissionRef
 */

import { Entity } from '../generic';

export interface FormSubmissionRef {
  /** Submission ID. */
  id: string;
  /** Submission account. */
  account: Entity;
}
