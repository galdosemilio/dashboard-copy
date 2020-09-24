/**
 * GET /content/form/:id
 */

import { createTestFromValidator, createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { formSectionRef, orgRef } from '../../../shared/index.test';
import { FormSingle } from './form.single';

export const formSingle = createValidator({
  /** Form ID. */
  id: t.string,
  /** Form name. */
  name: t.string,
  /** Organization to which the form belongs. */
  organization: orgRef,
  /** Maximum allowed submissions for a form. */
  maximumSubmissions: optional(t.number),
  /** A flag indicating if the form is active. */
  isActive: t.boolean,
  /** A flag indicating if the form allows adding addendums. */
  allowAddendum: t.boolean,
  /** Form sections. Only included if `full=true`. Inner collections, including this one, are already sorted by their sort order. */
  sections: optional(t.array(formSectionRef))
});

export const formResponse = createTestFromValidator<FormSingle>('FormSingle', formSingle);
