/**
 * Interface for GET /warehouse/sign-ups/list
 */

import { SignupsListSort } from '../entities';

export interface SignupsListRequest {
    organization: string;
    name?: string;
    startDate?: string;
    endDate?: string;
    limit?: 'all' | number;
    offset?: number;
    sort?: Array<SignupsListSort>;
}
