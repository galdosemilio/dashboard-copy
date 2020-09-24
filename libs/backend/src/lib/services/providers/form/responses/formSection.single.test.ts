/**
 * GET /content/form/section/:id
 */

import { createTestFromValidator, createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { formRef } from '../../../shared/index.test';
import { FormSectionSingle } from './formSection.single';

export const formSectionSingle = createValidator({
  /** The section ID. */
  id: t.string,
  /** Section title. */
  title: t.string,
  /** Additional description. */
  description: optional(t.string),
  /** Sort order of the section on the form. */
  sortOrder: t.number,
  /** A form that the section belongs to. */
  form: optional(formRef)
});

export const formSectionResponse = createTestFromValidator<FormSectionSingle>(
  'FormSectionSingle',
  formSectionSingle
);
