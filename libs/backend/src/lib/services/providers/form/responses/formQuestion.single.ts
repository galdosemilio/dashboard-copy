/**
 * GET /content/form/question/:id
 */

import { Entity, FormRef } from '../../../shared';

export interface FormQuestionSingle {
  /** Question ID. */
  id: string;
  /** Form section of question. */
  section: Entity;
  /** Type of a question. */
  questionType: Entity;
  /** A form that the question belongs to. */
  form?: FormRef;
  /** Question title. */
  title: string;
  /** Question description. */
  description?: string;
  /** Order number of question within section. */
  sortOrder: number;
  /** Indicates wether question should be answered or not. */
  isRequired: boolean;
  /** A collection of allowed responses to the question. */
  allowedValues?: Array<string>;
}
