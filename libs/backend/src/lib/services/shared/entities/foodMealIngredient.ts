/**
 * FoodMealIngredient
 */

export interface FoodMealIngredient {
  /** The id of the record. */
  id: string;
  /** The name of the record. */
  name: string;
  /** The type of the record. */
  type?: string;
  /** Image urls. */
  image: {
    /** The url of the thumbnail image for the ingredient. */
    thumbnail?: string;
    /** The url of the high res image for the ingredient. */
    highres?: string;
  };
}
