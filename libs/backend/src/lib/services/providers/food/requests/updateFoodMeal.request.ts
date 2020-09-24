/**
 * PATCH /food/meal/:id
 */

export interface UpdateFoodMealRequest {
  /** The ID of meal to update. */
  id: string;
  /** Desired new value of `isActive` field at target meal. */
  isActive?: boolean;
  /** New name of the meal. Should be non-empty string if passed. */
  name?: string;
  /** New vendor of the meal. If 'null' is passed then vendor will be defaulted to 'selvera'. */
  vendor?: string | null;
  /** New url of the image associated with this meal. Can be set to 'null'. */
  imageUrl?: string | null;
}
