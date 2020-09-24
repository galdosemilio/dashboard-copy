/**
 * foodFavoriteItem
 */

import { createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';

export const foodFavoriteItem = createValidator({
  /** The id of the favorite record. */
  id: t.string,
  /** The meal object record. */
  meal: createValidator({
    /** The id of the meal record. */
    id: t.string,
    /** The name of the meal record. */
    name: t.string,
    /** The boolean value if the meal is a public meal or not. */
    isPublic: t.boolean,
    /** The url of the image associated with this meal. */
    imageUrl: t.string
  }),
  /** The timestamp when the favorite entry was created. */
  createdAt: t.string
});
