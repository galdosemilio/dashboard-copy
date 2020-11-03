/**
 * Interface for GET /access/account
 */

import { AccAccesibleSort } from '../entities';

export interface AccListRequest {
    query?: string; // firstName, lastName, email
    account?: string; // default: current user
    accountType?: string;
    organization?: string;
    strict?: boolean; // results will include accounts for all child organizaations
    accessType?: 'association' | 'assignment';
    offset?: number;
    limit?: number | 'all';
    sort?: Array<AccAccesibleSort>;
}
