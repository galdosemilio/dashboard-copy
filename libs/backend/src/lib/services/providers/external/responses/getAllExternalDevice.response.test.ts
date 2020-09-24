/**
 * GET /measurement/device
 */

import { createTest, createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { GetAllExternalDeviceResponse } from './getAllExternalDevice.response';

export const getAllExternalDeviceResponse = createTest<GetAllExternalDeviceResponse>(
  'GetAllExternalDeviceResponse',
  {
    /** Array of measurement devices objects. */
    data: t.array(
      createValidator({
        /** The device id. */
        id: t.string,
        /** The title. */
        title: t.string,
        /** The device description. */
        description: t.string,
        /** The device adding timestamp. */
        addedAt: t.string
      })
    )
  }
);
