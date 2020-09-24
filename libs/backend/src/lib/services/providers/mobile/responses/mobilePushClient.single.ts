/**
 * GET /notification/mobile-push/client/:id
 */

export interface MobilePushClientSingle {
  /** The client ID. */
  id: string;
  /** The account ID. */
  account: string;
  /** Organization to which the client is associated. */
  organization: string;
  /** The Google project-id associated with the app. */
  projectId: string;
  /** The device token. */
  token: string;
  /** The user agent passed in by the client. */
  userAgent?: string;
}
