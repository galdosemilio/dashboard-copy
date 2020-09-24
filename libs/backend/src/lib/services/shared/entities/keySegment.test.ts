/**
 * keySegment
 */

import { createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';

export const keySegment = createValidator({
  /** Id of a key. */
  id: t.string,
  /** Name of a key. */
  name: t.string,
  /** Description of a key. */
  description: t.string,
  /** Date and time of key creation. */
  createdAt: t.string,
  /** Flag that indicates whether the key is active. */
  isActive: t.boolean
});
