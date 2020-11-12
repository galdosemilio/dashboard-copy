/**
 * GET /message/preference/account
 */

export interface GetAccountPreferenceRequest {
  /** The account id of the user. */
  account: string
  /** The id of the organization. */
  organization: string
}
