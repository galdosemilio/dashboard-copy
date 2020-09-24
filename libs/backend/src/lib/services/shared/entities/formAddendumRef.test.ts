/**
 * formAddendumRef
 */

import { createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { entity } from '../generic/index.test';

export const formAddendumRef = createValidator({
  /** Addendum ID. */
  id: t.string,
  /** Account. */
  account: entity,
  /** Addendum text content. */
  content: t.string,
  /** Timestamp indicating when the addendum was created. */
  createdAt: t.string
});
