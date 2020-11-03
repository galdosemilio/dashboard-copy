/**
 * Interface for GET /account
 */

import { AccSort } from '../entities';

export interface AccListAllRequest {
    query?: string; // firstName, lastName, email
    accountType?: string;
    organization?: string;
    includeInactive?: boolean; // default: false
    offset?: number;
    limit?: number | 'all';
    sort?: Array<AccSort>;
}
