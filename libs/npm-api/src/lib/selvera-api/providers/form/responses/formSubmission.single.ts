/**
 * GET /content/form/submission/:id
 */

import { NamedEntity } from '../../common/entities'
import {
  FormAddendumRef,
  FormAnswer,
  FormRefNamed,
  FormSubmissionAccountData
} from '../entities'

export interface FormSubmissionSingle {
  /** Submission ID. */
  id: string
  /** A form that the submission is related to. */
  form: FormRefNamed
  /** An account for which the submission is intended for. */
  account: FormSubmissionAccountData
  /** An account which submitted the form. */
  submittedBy: FormSubmissionAccountData
  /** Answers to form questions. */
  answers: Array<FormAnswer>
  /** Creation timestamp. */
  createdAt: string
  /** Addendum collection. */
  addendums: Array<FormAddendumRef>
  /** Organization.*/
  organization: NamedEntity
}
