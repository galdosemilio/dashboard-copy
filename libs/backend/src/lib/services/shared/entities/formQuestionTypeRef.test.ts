/**
 * formQuestionTypeRef
 */

import { createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';

export const formQuestionTypeRef = createValidator({
  /** Question type id. */
  id: t.string,
  /** Question type name. */
  name: t.string,
  /** Extra description. */
  description: t.string
});
