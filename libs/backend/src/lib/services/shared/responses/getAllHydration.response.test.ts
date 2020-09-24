/**
 * GET /hydration
 */

import { createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { pagination } from '../generic/index.test';

export const getAllHydrationResponse = createValidator({
  hydration: t.dictionary(
    t.any,
    t.type({
      quantity: t.number
    })
  ),
  pagination: pagination
});
