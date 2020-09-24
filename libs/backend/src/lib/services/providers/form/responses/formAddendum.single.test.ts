/**
 * GET /content/form/addendum/:id
 */

import { createTestFromValidator, createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { entity, formRefNamed, formSubmissionRef } from '../../../shared/index.test';
import { FormAddendumSingle } from './formAddendum.single';

export const formAddendumSingle = createValidator({
  /** Addendum ID. */
  id: t.string,
  /** Form. */
  form: formRefNamed,
  /** Submission. */
  submission: formSubmissionRef,
  /** Account. */
  account: entity,
  /** Addendum text content. */
  content: t.string,
  /** Timestamp indicating when the addendum was created. */
  createdAt: t.string
});

export const formAddendumResponse = createTestFromValidator<FormAddendumSingle>(
  'FormAddendumSingle',
  formAddendumSingle
);
