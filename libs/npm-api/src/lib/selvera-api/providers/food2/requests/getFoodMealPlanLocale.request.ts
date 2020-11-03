/**
 * GET /food/meal-plan/:id/locale/:locale
 */

export interface GetFoodMealPlanLocaleRequest {
    /** ID of the meal-plan. */
    id: string;
    /** Name of the locale. */
    locale: string;
}
