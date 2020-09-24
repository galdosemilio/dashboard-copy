/**
 * GET /notification
 */

import { createTest } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { alertItem, pagination } from '../../../shared/index.test';
import { GetAllAlertsResponse } from './getAllAlerts.response';

export const getAllAlertsResponse = createTest<GetAllAlertsResponse>('GetAllAlertsResponse', {
  /** Data element collection. */
  data: t.array(alertItem),
  /** Pagination object. */
  pagination: pagination
});
