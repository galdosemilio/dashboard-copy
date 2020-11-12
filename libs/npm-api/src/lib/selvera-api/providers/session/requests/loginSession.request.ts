/**
 * POST /login
 */

export interface LoginSessionRequest {
  /** The email address of the user to login. */
  email: string
  /** The password for the email address. */
  password: string
  /**
   * The device type of the logging-in user - must match a value in the device_type table.
   * If either iOS or Android, user token will be returned and no cookie will be set.
   * If Web, no token will be returned but a cookie will be set.
   */
  deviceType: string
  /**
   * The account types of the user to login - must match the value of the user's account type.
   * For clarity, this is simply used to prevent users from logging into the wrong section of the website.
   */
  allowedAccountTypes: Array<string>
}
