/**
 * OrganizationAccess
 */

import { OrganizationWithAddress } from './organization.interface';
import { OrganizationPermission } from './organizationPermission.interface';

export interface OrganizationAccess {
    organization: OrganizationWithAddress;
    permissions?: Partial<OrganizationPermission>;
    isDirect: boolean;
    associatedAt: string;
}
