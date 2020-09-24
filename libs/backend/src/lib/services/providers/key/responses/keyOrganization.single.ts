/**
 * GET /key/organization/:id
 */

export interface KeyOrganizationSingle {
  /** ID of the key-organization association. */
  id: string;
  /** ID of the organization. */
  organizationId: string;
  /** Key-organization data. */
  key: {
    /** ID of the key. */
    id: string;
    /** Key's name. */
    name: string;
    /** Key's description. */
    description: string;
    /** Key activity status flag. */
    isActive: boolean;
  };
  /** The default target quantity. */
  targetQuantity: number;
}
