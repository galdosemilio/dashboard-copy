/**
 * GET /food/favorite
 */

import { createTest } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { foodFavoriteItem, pagination } from '../../../shared/index.test';
import { GetAllFoodFavoriteResponse } from './getAllFoodFavorite.response';

export const getAllFoodFavoriteResponse = createTest<GetAllFoodFavoriteResponse>(
  'GetAllFoodFavoriteResponse',
  {
    /** Favorite items. */
    data: t.array(foodFavoriteItem),
    /** Pagination object. */
    pagination: pagination
  }
);
