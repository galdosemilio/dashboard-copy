/**
 * GET /food
 */

import { PagedResponse } from '../../content/entities';
import { FoodItem } from '../entities';

export type GetAllFoodResponse = PagedResponse<FoodItem>;
