/**
 * FormAnswer
 */

export interface FormAnswer {
  /** Question ID. */
  question: string;
  /** Response to the question. */
  response: {
    /** Response value. */
    value: any;
  };
}
