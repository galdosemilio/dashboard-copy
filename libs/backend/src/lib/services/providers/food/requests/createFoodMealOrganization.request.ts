/**
 * POST /food/meal/organization
 */

export interface CreateFoodMealOrganizationRequest {
  /** The id of the meal that is being associated. */
  mealId: string;
  /** The id of the organization to associate meal. */
  organization: string;
}
