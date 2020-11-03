/**
 * Interface for GET /warehouse/organization/activity
 */

import { TimelineUnit } from '../entities';

export interface OrganizationActivityRequest {
    organization: string;
    startDate: string;
    endDate: string;
    detailed?: boolean;
    activitySpan?: number;
    limit?: number | 'all';
    offset?: number;
    unit: TimelineUnit;
}
