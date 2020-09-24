/**
 * GET /warehouse/alert/type
 */

import { createTest, createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { pagination } from '../../../shared/index.test';
import { GetTypesAlertsResponse } from './getTypesAlerts.response';

export const getTypesAlertsResponse = createTest<GetTypesAlertsResponse>('GetTypesAlertsResponse', {
  /** Data collection. */
  data: t.array(
    createValidator({
      /** Alert type ID. */
      id: t.number,
      /** Description. */
      description: t.string,
      /** Unique code. */
      code: t.string
    })
  ),
  /** Pagination object. */
  pagination: pagination
});
