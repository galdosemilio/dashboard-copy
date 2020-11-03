/**
 * Interface for GET /key/account (response)
 */

import { AccSingleResponse } from '../../account/responses';
import { OrganizationEntity } from '../../organization/entities';
import { KeyDataEntity } from '../entities';

export interface FetchSingleAccountKeyResponse {
    id: string;
    targetQuantity: number;
    account: AccSingleResponse;
    organization: OrganizationEntity;
    key: KeyDataEntity;
}
