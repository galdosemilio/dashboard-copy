/**
 * Interface for GET /warehouse/weight/change
 */
import { ReportSort } from '../entities';

export interface WeightChangeRequest {
    organization: string;
    startDate: string;
    endDate: string;
    limit?: number | 'all';
    offset?: number;
    sort?: Array<ReportSort<'percentage' | 'value' | 'provider' | 'name'>>;
}
