/**
 * GET /food/consumed/frequent
 */

import { PagedResponse } from '../../content/entities';
import { FoodConsumedFrequently } from '../entities';

export type GetFrequentFoodConsumedResponse = PagedResponse<FoodConsumedFrequently>;
