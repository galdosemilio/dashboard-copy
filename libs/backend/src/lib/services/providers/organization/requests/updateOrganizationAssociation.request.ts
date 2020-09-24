/**
 * PATCH /association/:account/:organization
 */

import { AllOrgPermissions } from '../../../shared';

export interface UpdateOrganizationAssociationRequest {
  /** The ID of the client or provider account to associate. */
  account: string;
  /** The ID of the organization to associate this account to. */
  organization: string;
  /** A flag indicating if the association should be active or not. */
  isActive?: boolean;
  /** The permissions object. Only applies to provider accounts. */
  permissions?: Partial<AllOrgPermissions>;
}
