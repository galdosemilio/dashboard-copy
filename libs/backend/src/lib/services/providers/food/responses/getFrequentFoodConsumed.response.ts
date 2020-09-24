/**
 * GET /food/consumed/frequent
 */

import { FoodConsumedFrequently, PagedResponse } from '../../../shared';

export type GetFrequentFoodConsumedResponse = PagedResponse<FoodConsumedFrequently>;
