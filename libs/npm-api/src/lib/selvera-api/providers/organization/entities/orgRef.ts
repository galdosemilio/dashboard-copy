/**
 * OrgRef
 */

export interface OrgRef {
  /** Organization ID. */
  id: string
  /**
   * Organization name.
   * While it usually shouldn't be missing,
   * it might be if there is a data consistency issue between the gateway and the service.
   */
  name?: string
}
