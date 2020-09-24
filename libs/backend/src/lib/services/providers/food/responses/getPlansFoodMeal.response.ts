/**
 * GET /food/meal-plan
 */

import { BasicMealPlan, PagedResponse } from '../../../shared';

export type GetPlansFoodMealResponse = PagedResponse<BasicMealPlan>;
