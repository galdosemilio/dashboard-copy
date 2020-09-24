/**
 * GET /food/meal/organization/:id
 */

export interface FoodMealOrganizationSingle {
  /** Association ID. */
  id: string;
  /** The id of the meal from association. */
  mealId: string;
  /** The id of the organization from association. */
  organization: string;
  /** Indicates whether association is active or not. */
  isActive: boolean;
}
