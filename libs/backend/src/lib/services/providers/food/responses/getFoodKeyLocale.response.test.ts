/**
 * GET /food/key/:id/locale/:locale
 */

import { createTest, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { GetFoodKeyLocaleResponse } from './getFoodKeyLocale.response';

export const getFoodKeyLocaleResponse = createTest<GetFoodKeyLocaleResponse>(
  'GetFoodKeyLocaleResponse',
  {
    /** Localized name of a key. */
    name: optional(t.string),
    /** Localized description of a key. */
    description: optional(t.string)
  }
);
