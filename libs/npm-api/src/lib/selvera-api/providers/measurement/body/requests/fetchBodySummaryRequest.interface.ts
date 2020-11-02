/**
 * Interface for GET /measurement/body/summary
 */

import { SummaryData } from './summaryData.interface';
import { SummaryUnit } from './summaryUnit.interface';

export interface FetchBodySummaryRequest {
    account?: string;
    data: Array<SummaryData>;
    startDate: string;
    endDate?: string;
    max?: number | 'all';
    unit: SummaryUnit;
}
