/**
 * GET /food/meal
 */

import { FoodMealSegment, PagedResponse } from '../../../shared';

export type GetAllFoodMealResponse = PagedResponse<FoodMealSegment>;
