/**
 * orgEntity
 */

import { createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';

export const orgEntity = createValidator({
  /** The organization Id. */
  id: t.string,
  /** The organization name. */
  name: t.string,
  /** The organization shortcode. */
  shortcode: t.string,
  /** The organization hierarchy path. */
  hierarchyPath: t.array(t.string)
});
