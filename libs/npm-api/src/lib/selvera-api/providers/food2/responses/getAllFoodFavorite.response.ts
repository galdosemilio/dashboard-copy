/**
 * GET /food/favorite
 */

import { PagedResponse } from '../../content/entities'
import { FoodFavoriteItem } from '../entities'

export type GetAllFoodFavoriteResponse = PagedResponse<FoodFavoriteItem>
