/**
 * GET /measurement/device/sync
 */

import { createTest, createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { GetLastActivityExternalDeviceResponse } from './getLastActivityExternalDevice.response';

export const getLastActivityExternalDeviceResponse = createTest<
  GetLastActivityExternalDeviceResponse
>('GetLastActivityExternalDeviceResponse', {
  /** Array of measurement devices objects. */
  data: t.array(
    createValidator({
      /** The device id. */
      id: t.string,
      /** The title. */
      title: t.string,
      /** The service name from database. */
      service: t.string,
      /** The device description. */
      description: t.string,
      /**
       * Indicates when the service was last authenticated to.
       * Only available for devices that have third party integration set up at the given moment.
       */
      lastAuthenticatedAt: optional(t.string),
      /** Indicates when the last sync took place. Only available for third party data providers that are periodically synced. */
      lastSyncedAt: optional(t.string)
    })
  )
});
