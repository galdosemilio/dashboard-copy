/**
 * PATCH /content/form/question/:id
 */

export interface UpdateFormQuestionRequest {
  /** Question id. */
  id: string;
  /**
   * Order number of question within section.
   * Questions with equal or greater order number than given are pushed down - order number is increased.
   */
  sortOrder?: number;
}
