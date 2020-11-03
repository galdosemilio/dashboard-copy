/**
 * Interface for GET /warehouse/enrollment/accounts-by-organization/timeline
 */

import { TimelineUnit } from '../entities';

export interface PatientCountRequest {
    organization: string;
    startDate: string;
    endDate: string;
    package?: string;
    unit?: TimelineUnit;
    mode?: 'simple' | 'detailed';
}
