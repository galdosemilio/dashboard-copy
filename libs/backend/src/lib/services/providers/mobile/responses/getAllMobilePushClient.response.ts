/**
 * GET /notification/mobile-push/client
 */

export type GetAllMobilePushClientResponse = Array<{
  /** The client ID. */
  id: string;
  /** Organization to which the client is associated. */
  organization: string;
  /** The account ID. */
  account: string;
  /** The Google project-id associated with the app if admin. */
  projectId?: string;
  /** The device token if admin. */
  token?: string;
  /** The user-agent passed in if exists and is admin. */
  userAgent?: string;
}>;
