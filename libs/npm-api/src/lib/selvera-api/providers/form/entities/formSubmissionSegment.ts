/**
 * FormSubmissionSegment
 */

import { NamedEntity } from '../../common/entities'
import { FormRefNamed } from './formRefNamed'
import { FormSubmissionAccountData } from './formSubmissionAccountData'

export interface FormSubmissionSegment {
  /** Submission ID. */
  id: string
  /** A form that the submission is related to. */
  form: FormRefNamed
  /** An account for which the submission is intended for. */
  account: FormSubmissionAccountData
  /** An account which submitted the form. */
  submittedBy: FormSubmissionAccountData
  /** Creation timestamp. */
  createdAt: string
  /** Organization info */
  organization?: NamedEntity
}
