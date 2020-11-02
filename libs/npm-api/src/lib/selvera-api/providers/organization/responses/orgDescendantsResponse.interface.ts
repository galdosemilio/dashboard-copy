/**
 * Interface for /organization/id/descendants
 */

import { OrganizationEntity } from '../entities/index';
import { PaginationResponse } from './paginationResponse.interface';

export interface OrgDescendantsResponse {
    data: Array<OrganizationEntity>;
    pagination: PaginationResponse;
}
