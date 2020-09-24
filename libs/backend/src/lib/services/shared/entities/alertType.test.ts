/**
 * alertType
 */

import { createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';

export const alertType = createValidator({
  /** Alert type ID. */
  id: t.string,
  /** Description. */
  description: t.string,
  /** Unique code. */
  code: t.string
});
