/**
 * Interface for GET /nutrition/summary
 */

import { SummaryDataOption } from './summaryDataOption.type';

export interface FetchSummaryRequest {
    client: string;
    data: Array<SummaryDataOption>;
    endDate?: string;
    startDate: string;
    unit: 'day' | 'week' | 'month';
}
