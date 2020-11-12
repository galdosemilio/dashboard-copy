/**
 * GET /content/form/question/:id
 */

import { Entity } from '../../common/entities'
import { FormRef } from '../entities'

export interface FormQuestionSingle {
  /** Question ID. */
  id: string
  /** Form section of question. */
  section: Entity
  /** Type of a question. */
  questionType: Entity
  /** A form that the question is belongs to. */
  form?: FormRef
  /** Question title. */
  title: string
  /** Question description. */
  description?: string
  /** Order number of question within section. */
  sortOrder: number
  /** Indicates wether question should be answered or not. */
  isRequired: boolean
  /** A collection of allowed responses to the question. */
  allowedValues?: Array<string>
}
