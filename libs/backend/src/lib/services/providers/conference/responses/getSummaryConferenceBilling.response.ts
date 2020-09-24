/**
 * POST /conference/billing
 */

import { BillingSummaryItem, ListResponse } from '../../../shared';

export type GetSummaryConferenceBillingResponse = ListResponse<BillingSummaryItem>;
