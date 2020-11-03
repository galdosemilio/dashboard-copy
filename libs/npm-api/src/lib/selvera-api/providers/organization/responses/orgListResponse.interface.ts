/**
 * Interface for /organization
 */

import { AdminOrganization } from '../entities/index';
import { PaginationResponse } from './paginationResponse.interface';

export interface OrgListResponse {
    data: Array<AdminOrganization>;
    pagination: PaginationResponse;
}
