/**
 * Interface for GET /measurement/activity/summary
 */
import { SummaryData } from './summaryData.interface';
import { SummaryUnit } from './summaryUnit.interface';

export interface FetchActivitySummaryRequest {
    account?: string;
    data: Array<SummaryData>;
    startDate: string;
    endDate?: string;
    max?: number;
    unit: SummaryUnit;
}
