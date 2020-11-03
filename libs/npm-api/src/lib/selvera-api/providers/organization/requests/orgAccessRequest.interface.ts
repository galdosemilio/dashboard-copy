/**
 * Interface for GET /access/organization
 */

import { OrgAccesibleSort, OrganizationPermission } from '../entities';

export interface OrgAccessRequest {
    account?: string;
    query?: string;
    status?: 'active' | 'inactive' | 'all';
    ancestor?: string;
    strict?: boolean; // direct associated organizations only
    permissions?: Partial<OrganizationPermission>;
    limit?: 'all' | number;
    offset?: number;
    sort?: Array<OrgAccesibleSort>;
}
