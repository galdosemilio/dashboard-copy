/**
 * GET /food/preference
 */

import { createTest, createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { GetAllFoodPreferenceResponse } from './getAllFoodPreference.response';

export const getAllFoodPreferenceResponse = createTest<GetAllFoodPreferenceResponse>(
  'GetAllFoodPreferenceResponse',
  {
    /** Food tracking mode object. */
    mode: t.array(
      createValidator({
        /** Food tracking mode id. */
        id: t.string,
        /** Food tracking mode description. */
        description: t.string,
        /** Food tracking mode activity state for given organization hierarchy. */
        isActive: t.boolean
      })
    )
  }
);
