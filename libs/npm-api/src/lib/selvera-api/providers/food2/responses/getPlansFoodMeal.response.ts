/**
 * GET /food/meal-plan
 */

import { PagedResponse } from '../../content/entities';
import { BasicMealPlan } from '../entities';

export type GetPlansFoodMealResponse = PagedResponse<BasicMealPlan>;
