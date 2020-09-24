/**
 * formRef
 */

import { createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';

export const formRef = createValidator({
  /** Form ID. */
  id: t.string,
  /** Organization ID to which the form is attached. */
  organization: t.string
});
