/**
 * GET /food/meal
 */

import { PagedResponse } from '../../content/entities';
import { FoodMealSegment } from '../entities';

export type GetAllFoodMealResponse = PagedResponse<FoodMealSegment>;
