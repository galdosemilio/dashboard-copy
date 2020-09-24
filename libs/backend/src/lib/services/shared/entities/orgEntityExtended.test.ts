/**
 * orgEntityExtended
 */

import { createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { orgEntity } from './orgEntity.test';

export const orgEntityExtended = createValidator({
  ...orgEntity.type.props,
  /** Organization active flag. */
  isActive: t.boolean,
  /** Organization creation date. */
  createdAt: t.string
});
