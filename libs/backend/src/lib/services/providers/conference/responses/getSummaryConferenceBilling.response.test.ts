/**
 * POST /conference/billing
 */

import { createTest } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { billingSummaryItem } from '../../../shared/index.test';
import { GetSummaryConferenceBillingResponse } from './getSummaryConferenceBilling.response';

export const getSummaryConferenceBillingResponse = createTest<GetSummaryConferenceBillingResponse>(
  'GetSummaryConferenceBillingResponse',
  {
    /** Collection of billing summary items. */
    data: t.array(billingSummaryItem)
  }
);
