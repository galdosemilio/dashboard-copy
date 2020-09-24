/**
 * image
 */

import { createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';

export const image = createValidator({
  /** Thumbnail image URL. */
  thumbnail: optional(t.string),
  /** High-res image URL. */
  highres: optional(t.string)
});
