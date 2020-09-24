/**
 * GET /food/favorite
 */

import { FoodFavoriteItem, PagedResponse } from '../../../shared';

export type GetAllFoodFavoriteResponse = PagedResponse<FoodFavoriteItem>;
