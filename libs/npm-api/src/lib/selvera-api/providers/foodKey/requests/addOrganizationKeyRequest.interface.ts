/**
 * Interface for POST /key/organization
 */

export interface AddOrganizationKeyRequest {
    key: string;
    organization: string;
    icon?: string;
    targetQuantity?: number | string;
}
