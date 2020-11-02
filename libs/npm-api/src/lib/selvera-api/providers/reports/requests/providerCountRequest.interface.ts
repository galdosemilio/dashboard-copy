/**
 * Interface for GET /warehouse/provider/count
 */

import { TimelineUnit } from '../entities';

export interface ProviderCountRequest {
    organization: string;
    startDate: string;
    endDate: string;
    unit: TimelineUnit;
    mode?: 'simple' | 'detailed';
}
