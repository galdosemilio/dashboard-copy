/**
 * GET /food/consumed
 */

import { PagedResponse } from '../../../shared';
import { FoodConsumedSingle } from '../../food/responses/foodConsumed.single';

export type GetAllFoodConsumedResponse = PagedResponse<FoodConsumedSingle>;
