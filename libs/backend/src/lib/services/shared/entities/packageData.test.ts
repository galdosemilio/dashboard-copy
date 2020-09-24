/**
 * packageData
 */

import { createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';

export const packageData = createValidator({
  /** The id of this package entry. */
  id: t.string,
  /** The title of this package entry. */
  title: t.string,
  /** The description of this product. */
  description: optional(t.string),
  /** If this package is active. */
  isActive: t.boolean,
  /** The time this package was created. */
  createdAt: t.string,
  /** The time this package was updated. */
  updatedAt: t.string
});
