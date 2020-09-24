/**
 * GET /food/serving/:id/locale/:locale
 */

import { createTest, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { GetFoodServingLocaleResponse } from './getFoodServingLocale.response';

export const getFoodServingLocaleResponse = createTest<GetFoodServingLocaleResponse>(
  'GetFoodServingLocaleResponse',
  {
    /** A description of a serving. */
    description: optional(t.string),
    /** A measurement description. */
    measurementDescription: optional(t.string),
    /** Unit of a serving, at least one of description. */
    unit: optional(t.string)
  }
);
