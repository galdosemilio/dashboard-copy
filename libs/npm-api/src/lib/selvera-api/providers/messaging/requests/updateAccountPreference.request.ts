/**
 * PATCH /message/preference/account/:id
 */

export interface UpdateAccountMessagingPreferenceRequest {
  /** Preference id */
  id: string
  /** The flag enabling email notification */
  sendEmail?: boolean
  /** The Flag enabling push notification */
  sendPushNotification?: boolean
  /** The Flag deactivating whole preference */
  isActive?: boolean
}
