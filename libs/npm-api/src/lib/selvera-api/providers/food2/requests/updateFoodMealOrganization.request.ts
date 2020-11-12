/**
 * PATCH /food/meal/organization
 */

export interface UpdateFoodMealOrganizationRequest {
  /** The id of the meal-organization association. */
  id: string
  /** Indicates whether association is active or not. */
  isActive: boolean
}
