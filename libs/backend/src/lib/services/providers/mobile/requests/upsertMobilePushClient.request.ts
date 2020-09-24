/**
 * PUT /notification/mobile-push/client
 */

export interface UpsertMobilePushClientRequest {
  /**
   * The organization for the app the client is using.
   * (which may be different than the child organization to which the client actually belongs)
   */
  organization: string;
  /** The Google project-id associated with the app. */
  projectId: string;
  /** The push token for the device. */
  token: string;
}
