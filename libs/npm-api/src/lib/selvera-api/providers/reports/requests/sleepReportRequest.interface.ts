/**
 * Interface for GET /warehouse/sleep/basic
 */

import { ReportSort, TimelineUnit } from '../entities';

export interface SleepReportRequest {
    organization: string;
    startDate: string;
    endDate: string;
    unit: TimelineUnit;
    limit?: 'all' | number;
    offset?: number;
    sort?: Array<ReportSort<'hourSum' | 'hourMin' | 'hourMax' | 'hourAvg' | 'provider' | 'name'>>;
}
