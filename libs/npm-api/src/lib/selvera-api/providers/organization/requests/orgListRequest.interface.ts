/**
 * Interface for GET /organization
 */

import { OrgSort } from '../entities/index';

export interface OrgListRequest {
    organization?: number | string;
    name?: string;
    offset?: number;
    limit?: number | 'all';
    sort?: Array<OrgSort>;
}
