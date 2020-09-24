/**
 * POST /organization
 */

import { AddressItem, ContactItem } from '../../../shared';

export interface CreateOrganizationRequest {
  /** The name of the organization. */
  name: string;
  /** The internal code name of the organization, must be unique. */
  shortcode: string;
  /** Id of the parent organization. */
  parentOrganizationId: string;
  /** Organization contacts. */
  contact: ContactItem;
  /** If this organization is active. */
  isActive?: boolean;
  /** Address information. */
  address?: Partial<AddressItem>;
  /** The email address from which the welcome email will be sent. */
  welcomeEmailAddress?: string;
  /** The email address from which password reset emails will be sent. */
  passwordResetEmailAddress?: string;
  /** If true, any manager may associate a provider to this organization. */
  openAssociationAddProvider?: boolean;
  /** If true, any manager may associate a client to this organization. */
  openAssociationAddClient?: boolean;
}
