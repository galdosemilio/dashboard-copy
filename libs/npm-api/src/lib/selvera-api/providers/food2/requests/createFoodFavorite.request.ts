/**
 * POST /food/favorite
 */

export interface CreateFoodFavoriteRequest {
  /** The ID of the account that is adding the meal. */
  account: string
  /** The ID of the meal that is being saved as a favorite. */
  meal: string
}
