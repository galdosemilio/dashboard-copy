/**
 * POST /content/form/question-type
 */

export interface CreateFormQuestionTypeRequest {
  /** Question type id. */
  id: string;
  /** Question type name. */
  name: string;
  /** Question type description. */
  description?: string;
  /** A flag indicating if the question type is active. */
  isActive?: boolean;
  /** A flag indicating whether the question should require a list of values to be provided. */
  requiresValueList: boolean;
}
