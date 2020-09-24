/**
 * GET /supplement/consumption
 */

import { createTest, createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { supplementConsumed } from '../../../shared/index.test';
import { GetAllSupplementConsumptionResponse } from './getAllSupplementConsumption.response';

export const getAllSupplementConsumptionResponse = createTest<GetAllSupplementConsumptionResponse>(
  'GetAllSupplementConsumptionResponse',
  {
    /** The collection of consumption entries. */
    data: t.array(
      createValidator({
        /** The date of the supplements' consumption. */
        date: t.string,
        /** The collection of supplements' consumption entries. */
        consumption: t.array(
          createValidator({
            /** The consumption entry ID. */
            id: t.string,
            /** The supplement consumed. */
            supplement: supplementConsumed,
            /** The number of this supplement taken. */
            quantity: t.number
          })
        )
      })
    )
  }
);
