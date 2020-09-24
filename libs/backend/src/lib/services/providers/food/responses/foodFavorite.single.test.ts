/**
 * GET /food/favorite/:id
 */

import { createTestFromValidator, createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { entity, foodFavoriteSummary } from '../../../shared/index.test';
import { FoodFavoriteSingle } from './foodFavorite.single';

export const foodFavoriteSingle = createValidator({
  /** Favorite entry ID. */
  id: t.string,
  /** Meal entry. */
  meal: createValidator({
    /** Meal ID. */
    id: t.string,
    /** Meal name. */
    name: t.string,
    /** The timestamp of when the meal was created. */
    createdAt: t.string,
    /** The boolean value if the meal is a public meal or not. */
    isPublic: t.boolean,
    /** The url of the image associated with this meal. */
    imageUrl: t.string,
    /** Aggregation of nutrition values for the whole meal. */
    summary: foodFavoriteSummary
  }),
  /** A timestamp indicating when a favorite entry was created. */
  createdAt: t.string,
  /** The ID of the account for which the favorite entry was created. */
  account: entity
});

export const foodFavoriteResponse = createTestFromValidator<FoodFavoriteSingle>(
  'FoodFavoriteSingle',
  foodFavoriteSingle
);
