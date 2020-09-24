/**
 * packageRef
 */

import { createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';

export const packageRef = createValidator({
  /** Package ID. */
  id: t.string,
  /** Package Title. */
  title: t.string
});
