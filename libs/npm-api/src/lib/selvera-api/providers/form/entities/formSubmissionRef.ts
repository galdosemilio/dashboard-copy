/**
 * FormSubmissionRef
 */

import { Entity } from '../../common/entities'

export interface FormSubmissionRef {
  /** Submission ID. */
  id: string
  /** Submission account. */
  account: Entity
}
