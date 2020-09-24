/**
 * PUT /organization/:id
 */

import { AddressItem, ContactItem } from '../../../shared';

export interface UpdateOrganizationRequest {
  /** The id of the organization. */
  id: string;
  /** The name of the organization. Only editable by administrators. */
  name?: string;
  /** The internal code name of the organization, must be unique. Only editable by administrators. */
  shortcode?: string;
  /** Id of the desired parent organization. */
  parentOrganizationId?: string | null;
  /** If this organization is active. */
  isActive?: boolean;
  /** Organization contacts. */
  contact?: Partial<ContactItem>;
  /** Address information. */
  address?: Partial<AddressItem>;
  /** The email address from which the welcome email will be sent. Only editable by administrators. */
  welcomeEmailAddress?: string;
  /** The email address from which password reset emails will be sent. Only editable by administrators. */
  passwordResetEmailAddress?: string;
  /** If true, any manager may associate a provider to this organization. */
  openAssociationAddProvider?: boolean;
  /** If true, any manager may associate a client to this organization. */
  openAssociationAddClient?: boolean;
  /** Automatic organization disassociation flags */
  automaticDisassociation?: {
    /** Indicates whether client accounts should be automatically disassociated on a different association creation. */
    client: boolean;
  };
}
