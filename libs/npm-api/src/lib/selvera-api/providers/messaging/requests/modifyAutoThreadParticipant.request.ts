/**
 * Interface for PUT /message/preference/organization/{id}/auto-participation/{account} or DELETE /message/preference/organization/{id}/auto-participation/{account}
 */

export interface ModifyAutoThreadParticipantRequest {
  /** Preference ID */
  id: string
  /** Account ID */
  account: string
}
