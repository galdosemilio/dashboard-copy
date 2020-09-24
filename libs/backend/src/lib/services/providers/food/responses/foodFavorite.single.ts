/**
 * GET /food/favorite/:id
 */

import { Entity, FoodFavoriteSummary } from '../../../shared';

export interface FoodFavoriteSingle {
  /** Favorite entry ID. */
  id: string;
  /** Meal entry. */
  meal: {
    /** Meal ID. */
    id: string;
    /** Meal name. */
    name: string;
    /** The timestamp of when the meal was created. */
    createdAt: string;
    /** The boolean value if the meal is a public meal or not. */
    isPublic: boolean;
    /** The url of the image associated with this meal. */
    imageUrl: string;
    /** Aggregation of nutrition values for the whole meal. */
    summary: Partial<FoodFavoriteSummary>;
  };
  /** A timestamp indicating when a favorite entry was created. */
  createdAt: string;
  /** The ID of the account for which the favorite entry was created. */
  account: Entity;
}
