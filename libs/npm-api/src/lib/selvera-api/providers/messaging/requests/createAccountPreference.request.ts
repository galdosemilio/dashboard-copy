/**
 * GET /message/preference/account/:account/organization/:organization
 */

export interface CreateAccountMessagingPreferenceRequest {
  /** The account id of the user. */
  account: string
  /** The id of the organization. */
  organization: string
  /** The flag enabling email notification */
  sendEmail?: boolean
  /** The Flag enabling push notification */
  sendPushNotification?: boolean
}
