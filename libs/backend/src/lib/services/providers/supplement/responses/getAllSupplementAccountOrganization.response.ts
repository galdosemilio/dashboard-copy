/**
 * GET /supplement/account/organization/
 */

export interface GetAllSupplementAccountOrganizationResponse {
  /** Association ID. */
  id: string;
  /** ID of the supplement-organization association. */
  supplementOrganizationId: string;
  /** ID of the client account. */
  accountId: string;
  /** Custom, client-specific dosage. */
  dosage?: number;
}
