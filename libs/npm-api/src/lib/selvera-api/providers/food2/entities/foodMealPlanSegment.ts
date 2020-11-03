/**
 * FoodMealPlanSegment
 */

import { FoodMealPlanItem } from './foodMealPlanItem';

export interface FoodMealPlanSegment {
    /** ID of the meal plan. */
    id: string;
    /** Description of the meal plan. */
    description: string;
    /** Meal plan items. */
    items: Array<FoodMealPlanItem>;
}
