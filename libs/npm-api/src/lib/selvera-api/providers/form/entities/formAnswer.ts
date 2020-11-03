/**
 * FormAnswer
 */

import { Entity } from '../../common/entities'

export interface FormAnswer {
  /** Question ID. Entity when receiving, string when creating */
  question: Entity | string
  /** Response to the question. */
  response: {
    /** Response value. */
    value: any
  }
}
