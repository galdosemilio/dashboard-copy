/**
 * PATCH /content/form/question/:id
 */

export interface UpdateFormQuestionRequest {
  /**
   * List of possible responses to a question.
   * Required if questionType.requiresValueList = true. Can be `null` to clear the values list altogether. Cannot be updated if the form that contains the question already has submissions associated to it.
   */
  allowedValues?: string[]
  /**
   * Question description. Can be `null` to clear the description.
   * Cannot be updated if the form that contains the question already has submissions associated to it.
   */
  description?: string
  /** Question id. */
  id: string
  /**
   * Indicates wether question should be answered or not.
   * Cannot be changed to `true` if the form that contains the question already has submissions associated to it.
   */
  isRequired?: boolean
  /**
   * Question type ID.
   * Cannot be updated if the form that contains the question already has submissions associated to
   */
  questionType?: string
  /**
   * Section ID.
   * Cannot be updated if the form that contains the question already has submissions associated to it.
   */
  section?: string
  /**
   * Order number of question within section.
   * Questions with equal or greater order number than given are pushed down - order number is increased.
   */
  sortOrder?: number
  /** Question title. Cannot be updated if the form that contains the question already has submissions associated to it. */
  title?: string
}
