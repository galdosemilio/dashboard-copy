/**
 * GET /food/consumed
 */

import { PagedResponse } from '../../content/entities'
import { FoodConsumedSingle } from './foodConsumed.single'

export type GetAllFoodConsumedResponse = PagedResponse<FoodConsumedSingle>
