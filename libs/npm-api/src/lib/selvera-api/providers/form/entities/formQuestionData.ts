/**
 * FormQuestionData
 */

import { FormQuestionTypeRef } from './formQuestionTypeRef'

export interface FormQuestionData {
  /** Question type. */
  questionType: FormQuestionTypeRef
  /** Question title. */
  title: string
  /** Question description. */
  description?: string
  /** Order number of question within section. */
  sortOrder: number
  /** Indicates wether question should be required to be answered or not. */
  isRequired: boolean
}
