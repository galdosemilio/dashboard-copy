/**
 * Interface for GET /key/organization (response)
 */

import { OrganizationEntity } from '../../organization/entities';
import { KeyDataEntryActive } from '../entities';

export interface FetchSingleOrganizationKeyResponse {
    id: string;
    icon?: string;
    organization: OrganizationEntity;
    key: KeyDataEntryActive;
    targetQuantity: string;
    isActive: boolean;
}
