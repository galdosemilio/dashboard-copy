/**
 * FoodFavoriteItem
 */

export interface FoodFavoriteItem {
  /** The id of the favorite record. */
  id: string;
  /** The meal object record. */
  meal: {
    /** The id of the meal record. */
    id: string;
    /** The name of the meal record. */
    name: string;
    /** The boolean value if the meal is a public meal or not. */
    isPublic: boolean;
    /** The url of the image associated with this meal. */
    imageUrl: string;
  };
  /** The timestamp when the favorite entry was created. */
  createdAt: string;
}
