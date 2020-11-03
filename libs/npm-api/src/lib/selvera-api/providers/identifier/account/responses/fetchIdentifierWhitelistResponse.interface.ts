import { OrganizationWithoutShortcode } from '../../../organization/entities';

export interface FetchIdentifierWhitelistResponse {
    allowedNames: string[];
    createdAt: string;
    isActive: boolean;
    organization: OrganizationWithoutShortcode;
    updatedAt?: string;
}
