/**
 * POST /association
 */

import { AllOrgPermissions } from '../../../shared';

export interface CreateOrganizationAssociationRequest {
  /** The ID of the client or provider account to associate. */
  account: string;
  /** The ID of the organization to associate this account to. */
  organization: string;
  /** The permissions object for provider. */
  permissions?: Partial<AllOrgPermissions>;
}
