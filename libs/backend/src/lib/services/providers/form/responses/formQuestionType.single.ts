/**
 * GET /content/form/question-type/:id
 */

export interface FormQuestionTypeSingle {
  /** Question type ID. */
  id: string;
  /** Question type name. */
  name: string;
  /** Question type description. */
  description: string;
  /** A flag indicating if the question type is active. */
  isActive: boolean;
  /** A flag indicating whether the question should require a list of values to be provided. */
  requiresValueList: boolean;
}
