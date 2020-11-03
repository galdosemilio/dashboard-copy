/**
 * PUT /food/meal-plan/type/:id/locale/:locale
 */

export interface UpdateFoodMealPlanTypeLocaleRequest {
    /** ID of the meal-plan type. */
    id: string;
    /** Name of the locale. */
    locale: string;
    /** Translated description of a meal-plan type. */
    description?: string;
}
