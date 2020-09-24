/**
 * contentType
 */

import { createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';

export const contentType = createValidator({
  /** Item type ID. */
  id: t.number,
  /** Unique item type code. */
  code: t.string,
  /** Extended item type description. */
  description: t.string
});
