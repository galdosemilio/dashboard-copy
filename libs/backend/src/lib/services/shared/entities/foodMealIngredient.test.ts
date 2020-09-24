/**
 * foodMealIngredient
 */

import { createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';

export const foodMealIngredient = createValidator({
  /** The id of the record. */
  id: t.string,
  /** The name of the record. */
  name: t.string,
  /** The type of the record. */
  type: optional(t.string),
  /** Image urls. */
  image: createValidator({
    /** The url of the thumbnail image for the ingredient. */
    thumbnail: optional(t.string),
    /** The url of the high res image for the ingredient. */
    highres: optional(t.string)
  })
});
