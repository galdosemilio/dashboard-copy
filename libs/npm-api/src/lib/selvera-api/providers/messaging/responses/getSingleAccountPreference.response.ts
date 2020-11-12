/**
 * GET /message/preference/account/:id
 */

export interface GetSingleAccountPreferenceResponse {
  /** Preference id. */
  id: string
  /** Account placeholder */
  account: {
    /** Account id */
    id: string
  }
  /** Organization placeholder */
  organization: {
    /** Organization id */
    id: string
  }
  /** Flag enabling email notification */
  sendEmail: boolean
  /** Flag showing if push notification is enabled */
  sendPushNotification: boolean
  /** The Flag showing if preference is active */
  isActive: boolean
}
