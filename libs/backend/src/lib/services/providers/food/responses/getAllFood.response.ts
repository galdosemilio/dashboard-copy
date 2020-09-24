/**
 * GET /food
 */

import { FoodItem, PagedResponse } from '../../../shared';

export type GetAllFoodResponse = PagedResponse<FoodItem>;
